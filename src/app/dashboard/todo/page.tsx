"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

const filters = [
  { value: "all", label: "All tasks" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
] as const;

export default function TodoPage() {
  const { status } = useSession();
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchTodos();
    }
  }, [status, router]);

  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/todos");
      if (!response.ok) throw new Error("Failed to fetch todos");
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newTodo.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTodo }),
      });

      if (response.ok) {
        setNewTodo("");
        await fetchTodos();
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const response = await fetch("/api/todos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, completed: !completed }),
      });

      if (response.ok) {
        await fetchTodos();
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const deleteTodo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/todos?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchTodos();
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter((todo) => todo.completed).length,
    pending: todos.filter((todo) => !todo.completed).length,
  };

  const completionRate = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-rich-black">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4" />
          <p className="text-anti-flash-white/65">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rich-black">
      <section className="relative overflow-hidden border-b border-caribbean-green/15 px-4 py-12 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,223,129,0.14),transparent_24%),linear-gradient(180deg,rgba(3,34,33,0.9),rgba(2,26,26,0.95))]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />

        <div className="relative mx-auto max-w-7xl">
          <span className="eyebrow">Task management</span>
          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold text-anti-flash-white sm:text-5xl">
                Keep your day clear, one task at a time.
              </h1>
              <p className="mt-4 text-base leading-8 text-anti-flash-white/64 sm:text-lg">
                Add what matters, track completion, and keep the list readable instead of overwhelming.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="section-shell min-w-[10rem] p-4">
                <p className="text-sm text-anti-flash-white/52">Total tasks</p>
                <p className="mt-2 text-3xl font-bold text-anti-flash-white">{stats.total}</p>
              </div>
              <div className="section-shell min-w-[10rem] p-4">
                <p className="text-sm text-anti-flash-white/52">Completed</p>
                <p className="mt-2 text-3xl font-bold text-caribbean-green">{stats.completed}</p>
              </div>
              <div className="section-shell min-w-[10rem] p-4">
                <p className="text-sm text-anti-flash-white/52">Pending</p>
                <p className="mt-2 text-3xl font-bold text-mint">{stats.pending}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <section className="section-shell p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-anti-flash-white">Add a task</h2>
                  <p className="mt-1 text-sm text-anti-flash-white/55">
                    Keep it short and actionable so it is easy to complete later.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {filters.map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setFilter(item.value)}
                      className={`rounded-full px-4 py-2 text-sm font-medium ${
                        filter === item.value
                          ? "bg-caribbean-green text-rich-black"
                          : "border border-caribbean-green/18 bg-rich-black/30 text-anti-flash-white/68 hover:text-anti-flash-white"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={addTodo} className="mt-6 flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  placeholder="What needs your attention next?"
                  value={newTodo}
                  onChange={(event) => setNewTodo(event.target.value)}
                  className="flex-1 rounded-2xl border border-caribbean-green/20 bg-rich-black/45 px-4 py-3 text-anti-flash-white placeholder:text-stone focus:border-caribbean-green focus:outline-none focus:ring-2 focus:ring-caribbean-green/15"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-2xl bg-caribbean-green px-5 py-3 font-semibold text-rich-black hover:bg-mint disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Adding..." : "Add task"}
                </button>
              </form>
            </section>

            <section className="section-shell overflow-hidden">
              {filteredTodos.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-caribbean-green/10 text-2xl text-caribbean-green">
                    +
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-anti-flash-white">
                    {filter === "completed"
                      ? "No completed tasks yet."
                      : filter === "active"
                        ? "Nothing active right now."
                        : "Your list is empty."}
                  </h3>
                  <p className="mt-2 text-sm text-anti-flash-white/58">
                    {filter === "completed"
                      ? "Complete a task and it will show up here."
                      : filter === "active"
                        ? "You are caught up for now. Add your next focus above."
                        : "Add your first task to start building momentum."}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-caribbean-green/10">
                  {filteredTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => toggleTodo(todo.id, todo.completed)}
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                            todo.completed
                              ? "border-caribbean-green bg-caribbean-green text-rich-black"
                              : "border-caribbean-green/30 bg-rich-black/45 text-transparent hover:border-caribbean-green"
                          }`}
                          aria-label={todo.completed ? "Mark task as incomplete" : "Mark task as complete"}
                        >
                          <span className="text-xs font-bold">✓</span>
                        </button>

                        <div>
                          <p
                            className={`text-base font-medium ${
                              todo.completed ? "text-anti-flash-white/40 line-through" : "text-anti-flash-white"
                            }`}
                          >
                            {todo.title}
                          </p>
                          <p className="mt-1 text-xs text-anti-flash-white/45">
                            Added {new Date(todo.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteTodo(todo.id)}
                        disabled={deletingId === todo.id}
                        className="self-start rounded-full border border-red-500/20 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 disabled:opacity-50 sm:self-center"
                      >
                        {deletingId === todo.id ? "Removing..." : "Delete"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            <section className="section-shell p-6">
              <h2 className="text-xl font-semibold text-anti-flash-white">Progress</h2>
              <p className="mt-2 text-sm leading-7 text-anti-flash-white/58">
                Track how much of your list is done so you can see momentum, not just remaining work.
              </p>

              <div className="mt-6 rounded-3xl border border-caribbean-green/12 bg-rich-black/28 p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-anti-flash-white/52">Completion rate</p>
                    <p className="mt-2 text-4xl font-bold text-caribbean-green">{completionRate}%</p>
                  </div>
                  <div className="rounded-full border border-caribbean-green/12 px-3 py-1 text-xs text-anti-flash-white/52">
                    {stats.completed} of {stats.total || 0} done
                  </div>
                </div>

                <div className="mt-5 h-3 overflow-hidden rounded-full bg-rich-black/70">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-caribbean-green to-mint transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>
            </section>

            <section className="section-shell p-6">
              <h2 className="text-xl font-semibold text-anti-flash-white">Helpful rhythm</h2>
              <div className="mt-5 space-y-4 text-sm leading-7 text-anti-flash-white/62">
                <div className="rounded-3xl border border-caribbean-green/12 bg-rich-black/28 p-4">
                  Start with the one task you can finish fastest to build momentum.
                </div>
                <div className="rounded-3xl border border-caribbean-green/12 bg-rich-black/28 p-4">
                  Keep task titles specific so you know exactly what “done” means.
                </div>
                <div className="rounded-3xl border border-caribbean-green/12 bg-rich-black/28 p-4">
                  Review completed work before clearing the list so progress stays visible.
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
