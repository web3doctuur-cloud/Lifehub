"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";

const tools = [
  {
    id: "todo",
    title: "Smart Task Manager",
    description: "Plan your day, track progress, and keep your priorities visible.",
    image: "/assets/Images/task.jpg",
    link: "/dashboard/todo",
    category: "Planning",
  },
  {
    id: "notes",
    title: "Notes Workspace",
    description: "Capture ideas fast and revisit them without losing context.",
    image: "/assets/Images/book.jpg",
    link: "/dashboard/notes",
    category: "Writing",
  },
  {
    id: "calculator",
    title: "Quick Calculator",
    description: "Handle everyday calculations inside the same focused workspace.",
    image: "/assets/Images/calculator.jpg",
    link: "/dashboard/calculator",
    category: "Utility",
  },
  {
    id: "diary",
    title: "Digital Diary",
    description: "Reflect on your day and build a habit of thoughtful journaling.",
    image: "/assets/Images/task.jpg",
    link: "/dashboard/diary",
    category: "Reflection",
  },
  {
    id: "stories",
    title: "Storybook Library",
    description: "Read, explore, and recharge with a curated digital reading corner.",
    image: "/assets/Images/book.jpg",
    link: "/dashboard/storybooks",
    category: "Reading",
  },
];

const highlights = [
  { value: "5", label: "Connected tools" },
  { value: "1", label: "Unified workspace" },
  { value: "24/7", label: "Available across your routine" },
];

const principles = [
  {
    title: "See what matters fast",
    description: "Clear hierarchy, focused cards, and faster entry points reduce friction right away.",
  },
  {
    title: "Work from one calm space",
    description: "Tasks, notes, diary entries, and reading tools live together instead of fighting for attention.",
  },
  {
    title: "Keep momentum",
    description: "The interface stays lightweight so you can act quickly and return to what you were doing.",
  },
];

export default function LandingPage() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return tools;

    return tools.filter((tool) =>
      [tool.title, tool.description, tool.category].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [searchQuery]);

  return (
    <div className="relative overflow-hidden bg-rich-black">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute left-0 top-0 h-[34rem] w-[34rem] rounded-full bg-caribbean-green/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[32rem] w-[32rem] rounded-full bg-mint/10 blur-3xl" />

      <section className="relative">
        <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <span className="eyebrow">
              <span className="inline-block h-2 w-2 rounded-full bg-caribbean-green" />
              Digital organization without the clutter
            </span>

            <h1 className="mt-7 text-5xl font-bold leading-tight text-anti-flash-white sm:text-6xl lg:text-7xl">
              Make your workflow feel
              <span className="gradient-text"> calm, clear, and connected.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-anti-flash-white/68 sm:text-xl">
              LifeHub brings planning, note-taking, journaling, reading, and quick utility tools
              into one modern workspace so you can focus on doing the work instead of finding it.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={session ? "/dashboard/todo" : "/signup"}
                className="btn-primary px-7 py-3 text-center text-base font-semibold"
              >
                {session ? "Open workspace" : "Create free account"}
              </Link>
              <Link
                href="#tool-explorer"
                className="btn-outline px-7 py-3 text-center text-base font-semibold"
              >
                Explore tools
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item.label} className="section-shell p-4">
                  <p className="text-2xl font-bold text-caribbean-green">{item.value}</p>
                  <p className="mt-1 text-sm text-anti-flash-white/58">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="section-shell p-4 sm:p-6">
            <div className="rounded-[1.6rem] border border-caribbean-green/15 bg-rich-black/40 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-caribbean-green/75">Workspace snapshot</p>
                  <h2 className="mt-2 text-2xl font-semibold text-anti-flash-white">Everything you need, one jump away</h2>
                </div>
                <div className="hidden rounded-full border border-caribbean-green/15 bg-dark-green/60 px-3 py-1 text-xs text-anti-flash-white/60 sm:block">
                  Faster daily flow
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {tools.slice(0, 3).map((tool, index) => (
                  <div
                    key={tool.id}
                    className="flex items-center gap-4 rounded-2xl border border-caribbean-green/12 bg-dark-green/55 px-4 py-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-caribbean-green/12 font-semibold text-caribbean-green">
                      0{index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-anti-flash-white">{tool.title}</p>
                      <p className="truncate text-sm text-anti-flash-white/55">{tool.description}</p>
                    </div>
                    <span className="rounded-full border border-caribbean-green/15 px-3 py-1 text-xs text-anti-flash-white/55">
                      {tool.category}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-caribbean-green/12 bg-gradient-to-br from-caribbean-green/12 to-transparent p-5">
                <p className="text-sm font-medium text-caribbean-green">What improves here</p>
                <p className="mt-2 text-sm leading-7 text-anti-flash-white/65">
                  Cleaner hierarchy, consistent navigation, better search-driven discovery, and dashboard screens that finally feel like part of the same product.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tool-explorer" className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="eyebrow">Tool explorer</span>
              <h2 className="mt-5 text-3xl font-bold text-anti-flash-white sm:text-4xl">
                Find the part of LifeHub that matches what you need right now.
              </h2>
              <p className="mt-3 text-base leading-7 text-anti-flash-white/62 sm:text-lg">
                Search by activity, category, or outcome. The explorer now filters instead of acting like a visual placeholder.
              </p>
            </div>

            <div className="w-full max-w-xl">
              <label htmlFor="tool-search" className="mb-2 block text-sm font-medium text-anti-flash-white/65">
                Search LifeHub tools
              </label>
              <div className="relative">
                <svg
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  id="tool-search"
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Try tasks, writing, diary, utility..."
                  className="w-full rounded-[1.4rem] border border-caribbean-green/20 bg-dark-green/70 py-4 pl-12 pr-4 text-anti-flash-white placeholder:text-stone focus:border-caribbean-green focus:outline-none focus:ring-2 focus:ring-caribbean-green/15"
                />
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredTools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.link}
                className="group section-shell block overflow-hidden"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={tool.image}
                    alt={tool.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-rich-black via-rich-black/35 to-transparent" />
                  <div className="absolute left-4 top-4 rounded-full border border-caribbean-green/15 bg-rich-black/55 px-3 py-1 text-xs font-medium text-caribbean-green backdrop-blur-md">
                    {tool.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-anti-flash-white group-hover:text-caribbean-green">
                    {tool.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-anti-flash-white/60 sm:text-base">
                    {tool.description}
                  </p>
                  <div className="mt-6 flex items-center justify-between text-sm font-medium text-caribbean-green">
                    <span>Open tool</span>
                    <span aria-hidden="true" className="transition group-hover:translate-x-1">
                      {"->"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="section-shell mt-8 p-8 text-center">
              <p className="text-xl font-semibold text-anti-flash-white">No tools match that search yet.</p>
              <p className="mt-2 text-sm text-anti-flash-white/58">
                Try words like tasks, notes, writing, diary, reading, or calculator.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="section-shell p-8">
            <span className="eyebrow">Experience</span>
            <h2 className="mt-5 text-3xl font-bold text-anti-flash-white">A more intentional product experience</h2>
            <div className="mt-6 space-y-5">
              {principles.map((item) => (
                <div key={item.title} className="rounded-3xl border border-caribbean-green/12 bg-rich-black/28 p-5">
                  <h3 className="text-lg font-semibold text-anti-flash-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-anti-flash-white/60 sm:text-base">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="section-shell p-8 sm:p-10">
            <span className="eyebrow">Get started</span>
            <h2 className="mt-5 text-3xl font-bold text-anti-flash-white sm:text-4xl">
              Ready to organize your digital life in one place?
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-anti-flash-white/64 sm:text-lg">
              The refreshed interface is designed to help you move from intention to action faster, whether you are planning work, writing notes, or capturing personal reflections.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {!session ? (
                <>
                  <Link href="/signup" className="btn-primary px-7 py-3 text-center text-base font-semibold">
                    Create free account
                  </Link>
                  <Link href="/login" className="btn-outline px-7 py-3 text-center text-base font-semibold">
                    Sign in
                  </Link>
                </>
              ) : (
                <Link href="/dashboard/todo" className="btn-primary px-7 py-3 text-center text-base font-semibold">
                  Continue to dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
