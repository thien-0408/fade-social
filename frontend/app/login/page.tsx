"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "../../lib/auth";
import { ApiRequestError } from "../../lib/api";
import { useLoader } from "../../contexts/LoaderContext";

export default function LoginPage() {
    return (
        <Suspense>
            <LoginContent />
        </Suspense>
    );
}

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isNewUser = searchParams.get("registered") === "true";
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { startLoading } = useLoader();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login({ userName: username, password });
            startLoading(500);
            router.push(isNewUser ? "/setup-profile" : "/home");
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

    const handleGoogleLogin = () => {
        console.log("Google login clicked");
    };

    const handleGithubLogin = () => {
        console.log("Github login clicked");
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Hero Section */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 flex-col justify-between p-10 overflow-hidden">
                {/* Background Image Overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3ClinearGradient id='sky' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23192033'/%3E%3Cstop offset='50%25' style='stop-color:%231e293b'/%3E%3Cstop offset='100%25' style='stop-color:%23334155'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23sky)' width='1200' height='800'/%3E%3Cg fill='%23475569' opacity='0.3'%3E%3Crect x='100' y='300' width='80' height='500' rx='2'/%3E%3Crect x='200' y='250' width='60' height='550' rx='2'/%3E%3Crect x='280' y='350' width='100' height='450' rx='2'/%3E%3Crect x='400' y='200' width='70' height='600' rx='2'/%3E%3Crect x='490' y='280' width='90' height='520' rx='2'/%3E%3Crect x='600' y='320' width='50' height='480' rx='2'/%3E%3Crect x='670' y='380' width='80' height='420' rx='2'/%3E%3Crect x='770' y='250' width='60' height='550' rx='2'/%3E%3Crect x='850' y='300' width='100' height='500' rx='2'/%3E%3Crect x='970' y='350' width='70' height='450' rx='2'/%3E%3Crect x='1060' y='280' width='80' height='520' rx='2'/%3E%3C/g%3E%3Cpath d='M0 650 Q300 600 600 680 T1200 620 L1200 800 L0 800 Z' fill='%231e293b' opacity='0.8'/%3E%3C/svg%3E")`,
                    }}
                />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M8 12c0-2 2-4 4-4s4 2 4 4-2 4-4 4" strokeLinecap="round" />
                            <path d="M16 12c0 2-2 4-4 4s-4-2-4-4 2-4 4-4" strokeLinecap="round" />
                        </svg>
                    </div>
                    <span className="text-white/80 font-medium">Fade</span>
                </div>

                {/* Quote Section */}
                <div className="relative z-10 space-y-6">
                    <div className="w-12 h-1 bg-indigo-400 rounded-full" />
                    <h2 className="text-4xl md:text-5xl font-serif italic text-white leading-tight">
                        &ldquo;Time creates the memory,<br />
                        then kills it.&rdquo;
                    </h2>
                    <p className="text-slate-400 text-lg max-w-md">
                        Share your fleeting thoughts before the clock runs out.
                    </p>
                </div>

                {/* Footer */}
                <div className="relative z-10">
                    <p className="text-slate-500 text-sm tracking-widest uppercase">
                        Ephemeral Social · Est. 2024
                    </p>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
                            <span className="text-2xl">👻</span>
                        </div>
                        <p className="text-gray-500">Continue your session in the mist.</p>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
                            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all outline-none text-gray-800 placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </span>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all outline-none text-gray-800 placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-slate-600 focus:ring-slate-400 cursor-pointer"
                                />
                                <span className="text-sm text-gray-600">Remember for a while</span>
                            </label>
                            <Link
                                href="/forgot-password"
                                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Signing in…
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-400 uppercase tracking-wider text-xs">
                                Or sign in with
                            </span>
                        </div>
                    </div>

                    {/* OAuth Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={handleGithubLogin}
                            className="flex items-center justify-center gap-2 py-3.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                            </svg>
                            Github
                        </button>
                        <button
                            onClick={handleGoogleLogin}
                            className="flex items-center justify-center gap-2 py-3.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
                        >
                            <Image
                                src="/google.svg"
                                alt="Google logo"
                                width={20}
                                height={20}
                            />
                            Google
                        </button>
                    </div>

                    {/* Sign Up Link */}
                    <p className="text-center text-gray-600 mt-8">
                        New to Fade?{" "}
                        <Link
                            href="/register"
                            className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                        >
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
