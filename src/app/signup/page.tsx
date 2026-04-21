"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const setupPoints = [
  "Create an account in under a minute",
  "Manage tasks, notes, and diary entries in one place",
  "Move into the dashboard immediately after sign up",
];

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong while creating your account.");
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setError("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-rich-black">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <section className="mx-auto w-full max-w-lg lg:mx-0">
          <div className="mb-8 text-center lg:text-left">
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
            <p className="text-sm uppercase tracking-[0.2em] text-caribbean-green/80">Create account</p>
            <h1 className="mt-3 text-3xl font-bold text-anti-flash-white">Start your workspace</h1>
            <p className="mt-2 text-sm leading-7 text-anti-flash-white/60 sm:text-base">
              Join LifeHub and keep your planning, notes, and reflection in one focused environment.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-2xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-anti-flash-white/72">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-2xl border border-caribbean-green/20 bg-rich-black/45 px-4 py-3 text-anti-flash-white placeholder:text-stone focus:border-caribbean-green focus:outline-none focus:ring-2 focus:ring-caribbean-green/15"
                />
              </div>

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

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-anti-flash-white/72">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full rounded-2xl border border-caribbean-green/20 bg-rich-black/45 px-4 py-3 text-anti-flash-white placeholder:text-stone focus:border-caribbean-green focus:outline-none focus:ring-2 focus:ring-caribbean-green/15"
                  />
                </div>

                <div>
                  <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-anti-flash-white/72">
                    Confirm password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Repeat password"
                    className="w-full rounded-2xl border border-caribbean-green/20 bg-rich-black/45 px-4 py-3 text-anti-flash-white placeholder:text-stone focus:border-caribbean-green focus:outline-none focus:ring-2 focus:ring-caribbean-green/15"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-2xl bg-caribbean-green px-4 py-3 font-semibold text-rich-black shadow-[0_15px_40px_rgba(0,223,129,0.18)] hover:bg-mint disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-caribbean-green/12 bg-rich-black/25 px-4 py-3 text-sm text-anti-flash-white/58">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-caribbean-green hover:text-mint">
                Sign in here
              </Link>
            </div>
          </div>
        </section>

        <section className="section-shell hidden min-h-[42rem] overflow-hidden lg:block">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,26,26,0.35),rgba(2,26,26,0.92))]" />
          <Image
            src="/assets/Images/task.jpg"
            alt="LifeHub setup"
            fill
            className=" blur-md grayscale-[0.3] "
          />
          <div className="relative z-10 flex h-full flex-col justify-between p-10">
            <div>
              <span className="eyebrow">Quick onboarding</span>
              <h2 className="mt-6 max-w-xl text-5xl font-bold leading-tight text-anti-flash-white">
                Set up once, then keep everything in reach.
              </h2>
              <p className="mt-5 max-w-lg text-lg leading-8 text-anti-flash-white/70">
                The refreshed experience is built to get you from sign up to useful action quickly, without clutter or confusing handoffs.
              </p>
            </div>

            <div className="space-y-4">
              {setupPoints.map((point, index) => (
                <div
                  key={point}
                  className="flex items-start gap-4 rounded-3xl border border-caribbean-green/15 bg-rich-black/28 px-5 py-4 backdrop-blur-sm"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-caribbean-green/12 font-semibold text-caribbean-green">
                    {index + 1}
                  </div>
                  <p className="text-base leading-7 text-anti-flash-white/74">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
