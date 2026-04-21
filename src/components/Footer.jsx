"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

const productLinks = [
  { label: "Task Manager", href: "/dashboard/todo" },
  { label: "Notes", href: "/dashboard/notes" },
  { label: "Diary", href: "/dashboard/diary" },
  { label: "Storybooks", href: "/dashboard/storybooks" },
  { label: "Calculator", href: "/dashboard/calculator" },
];

export default function Footer() {
  const { data: session } = useSession();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-caribbean-green/15 bg-rich-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(47,169,140,0.12),transparent_30%),linear-gradient(180deg,rgba(3,34,33,0.9),rgba(2,26,26,1))]" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-caribbean-green via-mountain-meadow to-mint shadow-[0_10px_30px_rgba(0,223,129,0.25)]">
                <span className="text-lg font-black text-rich-black">L</span>
              </div>
              <div>
                <p className="text-xl font-semibold text-anti-flash-white">
                  Life<span className="text-caribbean-green">Hub</span>
                </p>
                <p className="text-sm text-anti-flash-white/50">A calmer way to run your day</p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-anti-flash-white/68 sm:text-base">
              One workspace for planning, writing, reflecting, and keeping momentum.
              LifeHub helps you stay organized without bouncing between disconnected tools.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="badge-success">Focused productivity</span>
              <span className="badge-info">Notes and journaling</span>
              <span className="badge-warning">Built for daily routines</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-caribbean-green/80">
              Explore
            </h3>
            <div className="mt-5 space-y-3">
              {(session ? productLinks : [
                { label: "Home", href: "/" },
                { label: "Login", href: "/login" },
                { label: "Create account", href: "/signup" },
              ]).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-anti-flash-white/70 hover:text-caribbean-green sm:text-base"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-caribbean-green/80">
              Product Notes
            </h3>
            <div className="mt-5 section-shell p-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-anti-flash-white">5</p>
                  <p className="text-sm text-anti-flash-white/55">Core tools</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-caribbean-green">1</p>
                  <p className="text-sm text-anti-flash-white/55">Unified workspace</p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-anti-flash-white/65">
                Designed to keep your planning, writing, and daily capture in the same calm environment.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-caribbean-green/15 pt-6 text-sm text-anti-flash-white/50 md:flex-row md:items-center md:justify-between">
          <p>Copyright {currentYear} LifeHub. Built for more focused digital routines.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-left text-caribbean-green hover:text-mint md:text-right"
          >
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
