"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      } else {
        router.push("/dashboard/todo");
      }
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-rich-black">
      {/* Left Side - Image (Hidden on mobile, visible on desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-green/90 via-rich-black/70 to-bangladesh-green/90 z-10"></div>
        
        {/* Task Management Image - Using HTML img tag */}
        <img
          src="/assets/Images/task.jpg"
          alt="Task Management"
          className="w-full h-full object-cover"
        />
        
        {/* Content Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-12">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-caribbean-green/20 backdrop-blur-sm border border-caribbean-green/30 rounded-full mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-caribbean-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-caribbean-green"></span>
              </span>
              <span className="text-caribbean-green text-sm font-medium">Welcome Back</span>
            </div>
            
            <h1 className="text-4xl xl:text-5xl font-bold text-anti-flash-white mb-4 leading-tight">
              Organize Your{' '}
              <span className="text-caribbean-green">Life</span>
              <br />
              Seamlessly
            </h1>
            
            <p className="text-anti-flash-white/70 text-lg mb-8 leading-relaxed">
              Access your tasks, notes, diary, and more. Everything you need to stay productive in one place.
            </p>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3">
              {["Task Manager", "Digital Notes", "Calculator", "Book Library"].map((feature, i) => (
                <span 
                  key={i}
                  className="px-4 py-2 bg-anti-flash-white/5 backdrop-blur-sm border border-caribbean-green/20 rounded-full text-anti-flash-white/80 text-sm"
                >
                  {feature}
                </span>
              ))}
            </div>
            
            {/* Stats */}
            <div className="flex gap-8 mt-12 pt-8 border-t border-caribbean-green/20">
              <div>
                <div className="text-2xl font-bold text-caribbean-green">10k+</div>
                <div className="text-anti-flash-white/50 text-sm">Active Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-caribbean-green">4.9</div>
                <div className="text-anti-flash-white/50 text-sm">User Rating</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-caribbean-green/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-mint/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Logo for Mobile */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-caribbean-green to-mint rounded-xl flex items-center justify-center shadow-lg shadow-caribbean-green/20">
                <span className="text-rich-black font-bold text-xl">L</span>
              </div>
              <span className="text-2xl font-bold text-anti-flash-white">
                Life<span className="text-caribbean-green">Hub</span>
              </span>
            </Link>
          </div>
          
          <div className="bg-dark-green/30 backdrop-blur-xl rounded-3xl p-8 border border-caribbean-green/20 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-anti-flash-white mb-2">
                Welcome Back!
              </h2>
              <p className="text-anti-flash-white/60">
                Sign in to continue to your account
              </p>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm backdrop-blur-sm">
                  {error}
                </div>
              )}
              
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-anti-flash-white/70 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 7.89a2 2 0 002.828 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-rich-black/50 border border-caribbean-green/20 rounded-xl text-anti-flash-white placeholder-stone focus:outline-none focus:border-caribbean-green focus:ring-2 focus:ring-caribbean-green/20 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              
              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-anti-flash-white/70 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 bg-rich-black/50 border border-caribbean-green/20 rounded-xl text-anti-flash-white placeholder-stone focus:outline-none focus:border-caribbean-green focus:ring-2 focus:ring-caribbean-green/20 transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone hover:text-caribbean-green transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-caribbean-green/30 bg-rich-black text-caribbean-green focus:ring-caribbean-green focus:ring-offset-0"
                  />
                  <span className="text-sm text-anti-flash-white/70">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-caribbean-green hover:text-mint transition-colors">
                  Forgot password?
                </Link>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-caribbean-green text-rich-black rounded-xl font-semibold hover:bg-mint transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-lg shadow-caribbean-green/20"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
              
              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-caribbean-green/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-dark-green/30 text-anti-flash-white/50">or</span>
                </div>
              </div>
              
              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-anti-flash-white/60 text-sm">
                  Don't have an account?{' '}
                  <Link href="/signup" className="text-caribbean-green hover:text-mint font-medium transition-colors">
                    Create free account
                  </Link>
                </p>
              </div>
            </form>
          </div>
          
          {/* Footer Text */}
          <p className="text-center text-anti-flash-white/40 text-xs mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}