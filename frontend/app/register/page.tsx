"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "../../lib/auth";
import { ApiRequestError } from "../../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ttlHours, setTtlHours] = useState(12);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register({ userName: displayName, email, password });
      router.push("/login?registered=true");
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    console.log("Google signup clicked");
  };

  const handleGithubSignup = () => {
    console.log("Github signup clicked");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black flex-col justify-between p-10 overflow-hidden">
        {/* Bokeh background effect */}
        <div className="absolute inset-0">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black opacity-80 z-10" />

          {/* Bokeh lights */}
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-yellow-400/60 blur-3xl animate-pulse" />
          <div
            className="absolute top-40 left-40 w-24 h-24 rounded-full bg-yellow-300/50 blur-2xl animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="absolute top-32 left-60 w-20 h-20 rounded-full bg-amber-400/40 blur-2xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute bottom-32 left-32 w-28 h-28 rounded-full bg-yellow-500/50 blur-3xl animate-pulse"
            style={{ animationDelay: "1.5s" }}
          />
          <div
            className="absolute bottom-20 left-56 w-24 h-24 rounded-full bg-amber-300/40 blur-2xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />

          <div
            className="absolute top-1/2 left-1/4 w-36 h-36 rounded-full bg-yellow-400/50 blur-3xl animate-pulse"
            style={{ animationDelay: "0.8s" }}
          />
          <div
            className="absolute top-1/3 right-1/3 w-20 h-20 rounded-full bg-amber-500/40 blur-2xl animate-pulse"
            style={{ animationDelay: "1.2s" }}
          />

          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-cyan-400/30 blur-3xl animate-pulse"
            style={{ animationDelay: "0.3s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-red-500/60 blur-xl animate-pulse"
            style={{ animationDelay: "1.8s" }}
          />

          <div
            className="absolute top-1/4 right-1/4 w-28 h-28 rounded-full bg-yellow-300/40 blur-3xl animate-pulse"
            style={{ animationDelay: "0.6s" }}
          />
          <div
            className="absolute bottom-1/3 right-1/3 w-32 h-32 rounded-full bg-amber-400/50 blur-3xl animate-pulse"
            style={{ animationDelay: "1.3s" }}
          />
        </div>

        {/* Logo */}
        <div className="relative z-20 flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white/80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M8 12c0-2 2-4 4-4s4 2 4 4-2 4-4 4"
                strokeLinecap="round"
              />
              <path
                d="M16 12c0 2-2 4-4 4s-4-2-4-4 2-4 4-4"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-white/80 font-semibold tracking-wide">
            FADE
          </span>
        </div>

        {/* Quote Section */}
        <div className="relative z-20 space-y-6">
          <div className="w-12 h-1 bg-amber-400 rounded-full" />
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            &ldquo;Some things are beautiful
            <br />
            precisely because they
            <br />
            don&apos;t last.&rdquo;
          </h2>
          <p className="text-slate-300 text-lg">Fade moments forever.</p>
        </div>

        {/* Empty footer space for balance */}
        <div className="relative z-20 h-8" />
      </div>

      {/* Right Panel - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Join Fade</h1>
            <p className="text-gray-500">
              Sign up to share the fleeting thoughts of the night.
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={handleGoogleSignup}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
            >
              <Image
                src="/google.svg"
                alt="Google logo"
                width={20}
                height={20}
              />
              Google
            </button>
            <button
              onClick={handleGithubSignup}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                />
              </svg>
              GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400 uppercase tracking-wider text-xs">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 mb-4">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Display Name Field */}
            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Display Name
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. MidnightWalker"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none text-gray-800 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none text-gray-800 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </span>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none text-gray-800 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Soul Sync TTL Slider */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <label className="text-sm font-semibold text-gray-900">
                    Soul Sync TTL
                  </label>
                </div>
                <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  {ttlHours} Hours
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                How long your posts survive before fading away forever.
              </p>
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="24"
                  value={ttlHours}
                  onChange={(e) => setTtlHours(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                  style={{
                    background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${((ttlHours - 1) / 23) * 100}%, #e5e7eb ${((ttlHours - 1) / 23) * 100}%, #e5e7eb 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1h</span>
                  <span>12h</span>
                  <span>24h</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#0f172a] hover:bg-[#1e293b] text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-black/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating account…
                </>
              ) : (
                <>
                  Fade In
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
