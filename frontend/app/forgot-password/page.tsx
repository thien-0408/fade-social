"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Password reset requested for:", email);
    };

    const handleGoogleRecover = () => {
        console.log("Google recovery clicked");
    };

    const handleGithubRecover = () => {
        console.log("Github recovery clicked");
    };

    const handleBiometricRecover = () => {
        console.log("Biometric recovery clicked");
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Hero Image */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {/* Ocean/Lighthouse Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 1600'%3E%3Cdefs%3E%3ClinearGradient id='sky' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%236b7c9e'/%3E%3Cstop offset='30%25' style='stop-color:%238b97b3'/%3E%3Cstop offset='60%25' style='stop-color:%23b8a8a0'/%3E%3Cstop offset='100%25' style='stop-color:%23d4b5a8'/%3E%3C/linearGradient%3E%3ClinearGradient id='ocean' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%234a5f7f'/%3E%3Cstop offset='100%25' style='stop-color:%23263852'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23sky)' width='1200' height='1000'/%3E%3Cpath d='M0 700 Q300 680 600 720 T1200 700 L1200 1000 L0 1000 Z' fill='url(%23ocean)' opacity='0.6'/%3E%3Cpath d='M0 800 Q200 780 400 810 T800 790 Q1000 780 1200 800 L1200 1000 L0 1000 Z' fill='url(%23ocean)' opacity='0.8'/%3E%3Cpath d='M0 900 Q300 880 600 920 T1200 900 L1200 1000 L0 1000 Z' fill='url(%23ocean)'/%3E%3Crect x='580' y='400' width='40' height='400' fill='%23334155' opacity='0.7'/%3E%3Cpolygon points='600,380 580,400 620,400' fill='%23475569' opacity='0.8'/%3E%3Ccircle cx='600' cy='420' r='15' fill='%23fbbf24' opacity='0.9'/%3E%3C/svg%3E")`,
                    }}
                >
                    {/* Dark overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
                </div>

                {/* Quote at bottom */}
                <div className="absolute bottom-12 left-12 right-12 z-10">
                    <p className="text-white text-xl md:text-2xl italic font-light leading-relaxed">
                        &ldquo;Memories fade, but the feeling remains. We help you find what was lost in the static.&rdquo;
                    </p>
                </div>
            </div>

            {/* Right Panel - Reset Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-gray-900">Fade</span>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">Recover Lost Memories</h1>
                        <p className="text-gray-600">Enter your email to find what was lost.</p>
                    </div>

                    {/* Reset Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                                Email address
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </span>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none text-gray-800 placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-3.5 bg-[#0f172a] hover:bg-[#0f172a] text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-indigo-600/40 transition-all duration-300"
                        >
                            Send Reset Link
                        </button>
                    </form>

                    {/* Back to Login Link */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to the present
                        </Link>
                    </div>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-400 uppercase tracking-wider text-xs">
                                Or recover using
                            </span>
                        </div>
                    </div>

                    {/* Alternative Recovery Options */}
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={handleGoogleRecover}
                            className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 group"
                            aria-label="Recover with Google"
                        >
                            <Image
                                src="/google.svg"
                                alt="Google"
                                width={22}
                                height={22}
                                className="group-hover:scale-110 transition-transform"
                            />
                        </button>
                        <button
                            onClick={handleGithubRecover}
                            className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 group"
                            aria-label="Recover with Github"
                        >
                            <svg className="w-6 h-6 text-gray-700 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                            </svg>
                        </button>
                        <button
                            onClick={handleBiometricRecover}
                            className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 group"
                            aria-label="Recover with Biometric"
                        >
                            <svg className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
