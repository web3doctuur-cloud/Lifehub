"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import React from "react";

const benefits = ["Tasks and planning", "Notes and writing", "Daily reflection", "Reading and utility tools"];

// Separate component that uses useSearchParams
function LoginContent() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Move useSearchParams inside this component
  const [registered, setRegistered] = useState<string | null>(null);
  
  // Use useEffect to read searchParams after mount (client-side only)
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRegistered(params.get("registered"));
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        return;
      }

      router.push("/dashboard/todo");
    } catch {
      setError("Something went wrong while signing you in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-rich-black">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8">
        <section className="section-shell hidden min-h-[42rem] overflow-hidden lg:block">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,26,26,0.35),rgba(2,26,26,0.92))]" />
          <Image
            src="/assets/Images/task.jpg"
            alt="LifeHub workspace"
            fill
            className="object-cover blur-md grayscale-[0.3] "
          />
          <div className="relative z-10 flex h-full flex-col justify-between p-10">
            <div>
              <span className="eyebrow">Welcome back</span>
              <h1 className="mt-6 max-w-xl text-5xl font-bold leading-tight text-anti-flash-white">
                Return to a workspace built to keep you focused.
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-8 text-anti-flash-white/70">
                Pick up where you left off with your tasks, notes, diary, and everyday tools in one calm interface.
              </p>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="rounded-2xl border border-caribbean-green/15 bg-rich-black/30 px-4 py-3 text-sm text-anti-flash-white/75 backdrop-blur-sm"
                  >
                    {benefit}
                  </div>
                ))}
              </div>

              <div className="flex gap-8 border-t border-caribbean-green/20 pt-6">
                <div>
                  <p className="text-3xl font-bold text-caribbean-green">5</p>
                  <p className="text-sm text-anti-flash-white/55">Connected tools</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-caribbean-green">1</p>
                  <p className="text-sm text-anti-flash-white/55">Unified space</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-lg">
          <div className="mb-8 text-center lg:hidden">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-caribbean-green to-mint">
                <span className="text-lg font-black text-rich-black">L</span>
              </div>
              <span className="text-2xl font-semibold text-anti-flash-white">
                Life<span className="text-caribbean-green">Hub</span>
              </span>
            </Link>
          </div>

          <div className="section-shell p-7 sm:p-8">
            <p className="text-sm uppercase tracking-[0.2em] text-caribbean-green/80">Sign in</p>
            <h2 className="mt-3 text-3xl font-bold text-anti-flash-white">Welcome back</h2>
            <p className="mt-2 text-sm leading-7 text-anti-flash-white/60 sm:text-base">
              Sign in to continue planning, writing, and tracking your day.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              {registered === "true" && (
                <div className="rounded-2xl border border-caribbean-green/30 bg-caribbean-green/10 px-4 py-3 text-sm text-caribbean-green">
                  Your account is ready. Sign in to open your dashboard.
                </div>
              )}

              {error && (
                <div className="rounded-2xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-anti-flash-white/72">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-caribbean-green/20 bg-rich-black/45 px-4 py-3 text-anti-flash-white placeholder:text-stone focus:border-caribbean-green focus:outline-none focus:ring-2 focus:ring-caribbean-green/15"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-anti-flash-white/72">
                    Password
                  </label>
                  <span className="text-sm text-anti-flash-white/45">Secure sign-in</span>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-caribbean-green/20 bg-rich-black/45 px-4 py-3 pr-12 text-anti-flash-white placeholder:text-stone focus:border-caribbean-green focus:outline-none focus:ring-2 focus:ring-caribbean-green/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-anti-flash-white/55 hover:text-caribbean-green"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-3 text-sm text-anti-flash-white/65">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-caribbean-green/30 bg-rich-black text-caribbean-green focus:ring-caribbean-green focus:ring-offset-0"
                />
                Keep me signed in on this device
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-2xl bg-caribbean-green px-4 py-3 font-semibold text-rich-black shadow-[0_15px_40px_rgba(0,223,129,0.18)] hover:bg-mint disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-caribbean-green/12 bg-rich-black/25 px-4 py-3 text-sm text-anti-flash-white/58">
              New to LifeHub?{" "}
              <Link href="/signup" className="font-medium text-caribbean-green hover:text-mint">
                Create your free account
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-rich-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-caribbean-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-anti-flash-white">Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}