"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/dashboard/todo", label: "Tasks" },
  { href: "/dashboard/notes", label: "Notes" },
  { href: "/dashboard/diary", label: "Diary" },
  { href: "/dashboard/storybooks", label: "Stories" },
  { href: "/dashboard/calculator", label: "Calculator" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const isActive = (href: string) => pathname === href;
  const firstName = session?.user?.name?.split(" ")[0] || session?.user?.email?.split("@")[0] || "You";
  const initial = session?.user?.name?.[0] || session?.user?.email?.[0]?.toUpperCase() || "U";

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-caribbean-green/15 bg-rich-black/80 shadow-[0_18px_60px_rgba(0,0,0,0.3)] backdrop-blur-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-18 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
          <Link href="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-caribbean-green via-mountain-meadow to-mint shadow-[0_10px_30px_rgba(0,223,129,0.25)]">
              <span className="text-lg font-black text-rich-black">L</span>
            </div>
            <div>
              <p className="text-lg font-semibold leading-none text-anti-flash-white sm:text-xl">
                Life<span className="text-caribbean-green">Hub</span>
              </p>
              <p className="hidden text-xs text-anti-flash-white/50 sm:block">
                Your calm digital workspace
              </p>
            </div>
          </Link>

          {session && (
            <div className="hidden flex-1 justify-center lg:flex">
              <div className="flex items-center gap-1 rounded-full border border-caribbean-green/15 bg-dark-green/55 p-1 backdrop-blur-xl">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      isActive(link.href)
                        ? "bg-caribbean-green text-rich-black shadow-[0_10px_25px_rgba(0,223,129,0.25)]"
                        : "text-anti-flash-white/70 hover:bg-anti-flash-white/5 hover:text-anti-flash-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="ml-auto hidden items-center gap-3 lg:flex">
            {session ? (
              <>
                <div className="flex items-center gap-3 rounded-full border border-caribbean-green/15 bg-dark-green/55 px-3 py-2 backdrop-blur-xl">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-caribbean-green to-mint font-semibold text-rich-black">
                    {initial}
                  </div>
                  <div className="pr-2">
                    <p className="text-sm font-medium text-anti-flash-white">{firstName}</p>
                    <p className="text-xs text-anti-flash-white/45">Ready to focus</p>
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="rounded-full border border-caribbean-green/20 px-4 py-2 text-sm font-medium text-anti-flash-white/75 hover:border-caribbean-green/40 hover:text-caribbean-green"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full px-4 py-2 text-sm font-medium text-anti-flash-white/80 hover:text-caribbean-green"
                >
                  Sign In
                </Link>
                <Link href="/signup" className="btn-primary text-sm font-semibold">
                  Start for Free
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen((value) => !value)}
            className="ml-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-caribbean-green/15 bg-dark-green/60 text-anti-flash-white lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <div className="relative h-4 w-5">
              <span
                className={`absolute left-0 h-0.5 w-5 bg-current transition-all ${
                  isMobileMenuOpen ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 h-0.5 w-5 bg-current transition-opacity ${
                  isMobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 h-0.5 w-5 bg-current transition-all ${
                  isMobileMenuOpen ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            className="absolute inset-0 bg-rich-black/75 backdrop-blur-md"
            aria-label="Close menu"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute inset-x-4 top-24 rounded-[2rem] border border-caribbean-green/20 bg-dark-green/95 p-5 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
            {session ? (
              <div className="mb-5 flex items-center gap-3 rounded-3xl border border-caribbean-green/15 bg-rich-black/40 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-caribbean-green to-mint font-semibold text-rich-black">
                  {initial}
                </div>
                <div>
                  <p className="font-medium text-anti-flash-white">{firstName}</p>
                  <p className="text-sm text-anti-flash-white/45">{session.user?.email}</p>
                </div>
              </div>
            ) : (
              <div className="mb-5 rounded-3xl border border-caribbean-green/15 bg-rich-black/40 p-4">
                <p className="text-sm uppercase tracking-[0.2em] text-caribbean-green/80">Welcome</p>
                <p className="mt-2 text-lg font-semibold text-anti-flash-white">
                  Build a calmer routine with LifeHub.
                </p>
              </div>
            )}

            {session && (
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 text-base font-medium ${
                      isActive(link.href)
                        ? "bg-caribbean-green text-rich-black"
                        : "bg-rich-black/30 text-anti-flash-white/80 hover:bg-rich-black/45"
                    }`}
                  >
                    {link.label}
                    <span aria-hidden="true">+</span>
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-5 space-y-3 border-t border-caribbean-green/15 pt-5">
              {session ? (
                <button
                  onClick={() => signOut()}
                  className="w-full rounded-2xl border border-caribbean-green/20 px-4 py-3 text-left text-base font-medium text-anti-flash-white/80"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block rounded-2xl border border-caribbean-green/20 px-4 py-3 text-center text-base font-medium text-anti-flash-white/85"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block rounded-2xl bg-caribbean-green px-4 py-3 text-center text-base font-semibold text-rich-black"
                  >
                    Start for Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="h-18 lg:h-20" />
    </>
  );
}
