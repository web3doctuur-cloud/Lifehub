"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  createdAt: string;
}

export default function NotesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchNotes();
    }
  }, [status, router]);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const text = await res.text();
      if (!text) {
        setNotes([]);
        return;
      }
      const data = JSON.parse(text);
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setNotes([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      if (editingId) {
        const res = await fetch("/api/notes", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, title, content }),
        });
        if (res.ok) {
          await fetchNotes();
          resetForm();
        }
      } else {
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content }),
        });
        if (res.ok) {
          await fetchNotes();
          resetForm();
        }
      }
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      setDeletingId(id);
      try {
        const res = await fetch(`/api/notes?id=${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          await fetchNotes();
        }
      } catch (error) {
        console.error("Error deleting note:", error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handlePreview = (note: Note) => {
    setSelectedNote(note);
    setIsPreviewOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: notes.length,
    recent: notes.filter(n => new Date(n.updatedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).length,
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-rich-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-caribbean-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-anti-flash-white/70">Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rich-black">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-dark-green via-rich-black to-bangladesh-green py-12 border-b border-caribbean-green/20 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-caribbean-green/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-mountain-meadow/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-mint/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-caribbean-green/10 border border-caribbean-green/30 rounded-full mb-6 backdrop-blur-sm">
              <svg className="w-5 h-5 text-caribbean-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span className="text-caribbean-green text-sm font-medium">Digital Notes</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-anti-flash-white mb-4">
              My <span className="text-caribbean-green">Notes</span>
            </h1>
            <p className="text-lg text-anti-flash-white/60">
              Capture, organize, and access your thoughts anytime, anywhere.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-dark-green/50 backdrop-blur-sm rounded-xl p-6 border border-caribbean-green/20 hover:border-caribbean-green/40 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-anti-flash-white/50 text-sm mb-1">Total Notes</p>
                  <p className="text-3xl font-bold text-anti-flash-white">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-caribbean-green/10 rounded-lg flex items-center justify-center border border-caribbean-green/20">
                  <svg className="w-6 h-6 text-caribbean-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-dark-green/50 backdrop-blur-sm rounded-xl p-6 border border-caribbean-green/20 hover:border-caribbean-green/40 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-anti-flash-white/50 text-sm mb-1">Recent (7 days)</p>
                  <p className="text-3xl font-bold text-mint">{stats.recent}</p>
                </div>
                <div className="w-12 h-12 bg-mint/10 rounded-lg flex items-center justify-center border border-mint/20">
                  <svg className="w-6 h-6 text-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search notes by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-dark-green/50 backdrop-blur-sm border border-caribbean-green/20 rounded-xl text-anti-flash-white placeholder-stone focus:outline-none focus:border-caribbean-green focus:ring-1 focus:ring-caribbean-green transition-all"
              />
            </div>
          </div>

          {/* Note Form */}
          <div className="bg-dark-green/50 backdrop-blur-sm rounded-xl border border-caribbean-green/20 p-6 mb-8">
            <div className="flex items-center space-x-2 mb-4">
              {editingId ? (
                <>
                  <svg className="w-6 h-6 text-caribbean-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <h2 className="text-2xl font-semibold text-anti-flash-white">Edit Note</h2>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 text-caribbean-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <h2 className="text-2xl font-semibold text-anti-flash-white">Create New Note</h2>
                </>
              )}
            </div>
            
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Note Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-rich-black/80 border border-caribbean-green/20 rounded-lg p-3 mb-4 text-anti-flash-white placeholder-stone focus:outline-none focus:border-caribbean-green focus:ring-1 focus:ring-caribbean-green transition-all"
                required
              />
              <textarea
                placeholder="Write your note content here... Use Markdown for formatting"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full bg-rich-black/80 border border-caribbean-green/20 rounded-lg p-3 mb-4 text-anti-flash-white placeholder-stone focus:outline-none focus:border-caribbean-green focus:ring-1 focus:ring-caribbean-green transition-all font-mono text-sm"
                required
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-2 bg-caribbean-green hover:bg-mint text-rich-black rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none font-medium shadow-lg shadow-caribbean-green/20"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-rich-black border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      <span>{editingId ? "Update Note" : "Save Note"}</span>
                    </>
                  )}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 bg-forest/50 hover:bg-forest/70 text-anti-flash-white rounded-lg transition-all duration-200 border border-forest/50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Notes Grid */}
          {filteredNotes.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-24 h-24 mx-auto text-stone mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-anti-flash-white/60 text-lg">
                {searchTerm ? "No notes match your search." : "No notes yet. Create your first note above!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note, index) => (
                <div
                  key={note.id}
                  className="group bg-dark-green/50 backdrop-blur-sm rounded-xl border border-caribbean-green/20 hover:border-caribbean-green/50 transition-all duration-300 hover:transform hover:-translate-y-1 animate-fadeIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-anti-flash-white group-hover:text-caribbean-green transition line-clamp-1">
                        {note.title}
                      </h3>
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handlePreview(note)}
                          className="p-1 text-anti-flash-white/50 hover:text-caribbean-green transition"
                          title="Preview"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-anti-flash-white/60 mb-4 line-clamp-3 text-sm leading-relaxed">
                      {note.content}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-stone">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(note)}
                          className="text-caribbean-green hover:text-mint text-sm transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(note.id)}
                          disabled={deletingId === note.id}
                          className="text-red-400 hover:text-red-300 text-sm transition disabled:opacity-50"
                        >
                          {deletingId === note.id ? "..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rich-black/90 backdrop-blur-sm animate-fadeIn">
          <div className="bg-dark-green rounded-xl border border-caribbean-green/30 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-dark-green border-b border-caribbean-green/20 p-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-anti-flash-white">{selectedNote.title}</h3>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1 text-anti-flash-white/50 hover:text-caribbean-green transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="text-anti-flash-white/80 whitespace-pre-wrap">
                {selectedNote.content}
              </div>
              <div className="mt-4 pt-4 border-t border-caribbean-green/20 text-xs text-stone">
                Created: {new Date(selectedNote.createdAt).toLocaleString()}<br />
                Last updated: {new Date(selectedNote.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}