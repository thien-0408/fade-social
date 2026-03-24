"use client";

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05050A] text-slate-900 dark:text-white selection:bg-indigo-500/30 transition-colors duration-300 overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#05050A]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 relative flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
               <Image src="/Logo.png" alt="Fade Logo" fill className="object-contain" priority />
            </div>
            <span className="hidden sm:block text-xl font-bold tracking-tight text-slate-900 dark:text-white">FADE</span>
          </Link>

          {/* Right side buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1A1D2D] hover:bg-slate-100 dark:hover:bg-[#25283d] text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium rounded-lg transition-all duration-300 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none"
            >
              <Image src="/google.svg" alt="" width={16} height={16} className="opacity-80" />
              <span className="hidden sm:inline">Login with Google</span>
              <span className="sm:hidden">Google</span>
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1A1D2D] hover:bg-slate-100 dark:hover:bg-[#25283d] text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium rounded-lg transition-all duration-300 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none"
            >
              <svg className="w-4 h-4 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              <span className="hidden sm:inline">Login with GitHub</span>
              <span className="sm:hidden">GitHub</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center justify-center pt-20">
        {/* Dynamic Abstract Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tl from-indigo-500/20 to-blue-500/20 dark:from-indigo-500/10 dark:to-blue-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:opacity-10 opacity-30"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center max-w-5xl" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 mb-8 backdrop-blur-sm shadow-sm" data-aos="fade-down" data-aos-delay="200">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">Version 2.0 is live</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold text-slate-900 dark:text-white mb-8 leading-[1.1] tracking-tight" data-aos="zoom-in-up" data-aos-delay="300">
            Some things are<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-400" style={{ backgroundSize: '200% auto', animation: 'gradient 8s linear infinite' }}>
              better left behind.
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light" data-aos="fade-up" data-aos-delay="400">
             Share your fleeting thoughts. Watch them fade away.<br />
            The social network designed for the impermanent.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center" data-aos="fade-up" data-aos-delay="500">
            <Link
              href="/register"
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all duration-300 min-w-[200px]"
            >
              Start Fading
            </Link>
            <Link
              href="#about"
              className="flex items-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 dark:bg-[#1A1D2D] dark:hover:bg-[#25283d] dark:text-white font-semibold rounded-xl border border-slate-200 dark:border-white/10 shadow-sm transition-all duration-300 min-w-[200px] justify-center hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5 text-slate-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch Film
            </Link>
          </div>

          {/* Scroll arrow */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-400 dark:text-gray-500 animate-bounce">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-[#05050A] transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              The Art of Letting Go
            </h2>
            <p className="text-xl text-slate-600 dark:text-gray-400 max-w-3xl">
              Experience a social platform designed for the present moment, where nothing lasts forever and digital footprints wash away.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 dark:bg-[#0F111A] p-10 rounded-3xl border border-slate-200 dark:border-white/5 hover:border-indigo-300 dark:hover:border-indigo-500/30 shadow-sm hover:shadow-xl dark:shadow-none hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-[#1A1D2D] flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-600/20 transition-colors">
                <svg className="w-7 h-7 text-indigo-600 dark:text-indigo-400 group-hover:text-white dark:group-hover:text-indigo-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Fleeting Thoughts
              </h3>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                Set a timer. Speak your truth. When the clock strikes zero, it&apos;s gone forever from our servers and your feed.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 dark:bg-[#0F111A] p-10 rounded-3xl border border-slate-200 dark:border-white/5 hover:border-indigo-300 dark:hover:border-indigo-500/30 shadow-sm hover:shadow-xl dark:shadow-none hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-[#1A1D2D] flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-600/20 transition-colors">
                <svg className="w-7 h-7 text-indigo-600 dark:text-indigo-400 group-hover:text-white dark:group-hover:text-indigo-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Whisper Messaging
              </h3>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                Encrypted conversations that evaporate once read. No history, no screenshots, no regrets. Just like real whispers.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 dark:bg-[#0F111A] p-10 rounded-3xl border border-slate-200 dark:border-white/5 hover:border-indigo-300 dark:hover:border-indigo-500/30 shadow-sm hover:shadow-xl dark:shadow-none hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-[#1A1D2D] flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-600/20 transition-colors">
                <svg className="w-7 h-7 text-indigo-600 dark:text-indigo-400 group-hover:text-white dark:group-hover:text-indigo-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Soul Sync
              </h3>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                Customize your digital decay. Choose how fast your memories fade based on your emotional state.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lifecycle Section */}
      <section className="py-32 bg-slate-50 dark:bg-[#05050A] relative transition-colors duration-300 border-t border-slate-200 dark:border-white/5 border-b">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 dark:text-white mb-24 tracking-tight">
            Lifecycle of a Memory
          </h2>

          <div className="relative max-w-5xl mx-auto">
            {/* Center Line */}
            <div className="absolute left-[30px] md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 via-purple-400 to-slate-200 dark:to-gray-800 md:-translate-x-1/2 rounded-full opacity-50 dark:opacity-30"></div>

            <div className="space-y-32">
              {/* Step 1 */}
              <div className="relative flex flex-col md:flex-row items-center justify-between group">
                <div className="md:w-5/12 text-left md:text-right order-2 md:order-1 pl-20 md:pl-0 pt-4 md:pt-0">
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Create a Thought</h3>
                  <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">Compose your message, add a photo, or record a voice note. Capture the raw emotion of the now.</p>
                </div>
                <div className="absolute left-6 md:left-1/2 w-16 h-16 -translate-x-[2px] md:-translate-x-1/2 rounded-full bg-indigo-600 border-[6px] border-slate-50 dark:border-[#05050A] shadow-lg shadow-indigo-600/30 z-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                </div>
                <div className="md:w-5/12 order-3 md:order-2"></div>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col md:flex-row items-center justify-between group">
                <div className="md:w-5/12 order-2 md:order-1 md:text-right"></div>
                <div className="absolute left-6 md:left-1/2 w-16 h-16 -translate-x-[2px] md:-translate-x-1/2 rounded-full bg-white dark:bg-[#1A1D2D] border-[6px] border-slate-100 dark:border-[#05050A] shadow-md dark:shadow-none z-10 flex items-center justify-center group-hover:border-indigo-200 dark:group-hover:border-indigo-500/30 group-hover:scale-110 transition-all duration-300">
                  <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                </div>
                <div className="md:w-5/12 text-left order-3 md:order-2 pl-20 md:pl-0 pt-4 md:pt-0">
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Share with Friends</h3>
                  <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">Send to close circles or broadcast to the void. Your audience sees it, feels it, and reacts.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col md:flex-row items-center justify-between group">
                <div className="md:w-5/12 text-left md:text-right order-2 md:order-1 pl-20 md:pl-0 pt-4 md:pt-0">
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Watch it Fade</h3>
                  <p className="text-lg text-slate-500 dark:text-gray-400 leading-relaxed">The timer ticks down. The image desaturates. The text blurs. A visual representation of time passing.</p>
                </div>
                <div className="absolute left-6 md:left-1/2 w-16 h-16 -translate-x-[2px] md:-translate-x-1/2 rounded-full bg-slate-100 dark:bg-[#1A1D2D] border-[6px] border-slate-50 dark:border-[#05050A] z-10 flex items-center justify-center opacity-80 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="md:w-5/12 order-3 md:order-2"></div>
              </div>

              {/* Step 4 */}
              <div className="relative flex flex-col md:flex-row items-center justify-between group opacity-70 hover:opacity-100 transition-opacity duration-300">
                <div className="md:w-5/12 order-2 md:order-1"></div>
                <div className="absolute left-6 md:left-1/2 w-16 h-16 -translate-x-[2px] md:-translate-x-1/2 rounded-full bg-slate-200 dark:bg-[#11131E] border-[6px] border-slate-50 dark:border-[#05050A] z-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-slate-400 dark:text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </div>
                <div className="md:w-5/12 text-left order-3 md:order-2 pl-20 md:pl-0 pt-4 md:pt-0">
                  <h3 className="text-3xl font-bold text-slate-400 dark:text-gray-500 mb-3 tracking-tight">Gone Forever</h3>
                  <p className="text-lg text-slate-400/80 dark:text-gray-600 leading-relaxed">No archives. No backups. Just the memory of what was shared. Pure, digital silence.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-white dark:bg-[#05050A] relative overflow-hidden transition-colors duration-300 border-b border-slate-200 dark:border-white/5">
        {/* Glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 dark:bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
            Ready to disappear?
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-gray-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Join the community where moments matter because they end.<br />
            Create your account in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white dark:bg-[#1A1D2D] hover:bg-slate-50 dark:hover:bg-[#25283d] text-slate-900 dark:text-white font-semibold rounded-xl shadow-md dark:shadow-lg dark:shadow-indigo-900/30 border border-slate-200 dark:border-transparent transition-all duration-300 min-w-[220px] hover:-translate-y-0.5"
            >
              <Image src="/google.svg" alt="" width={20} height={20} className="" />
              <span>Continue with Google</span>
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white dark:bg-[#1A1D2D] hover:bg-slate-50 dark:hover:bg-[#25283d] text-slate-900 dark:text-white font-semibold rounded-xl border border-slate-200 dark:border-white/10 shadow-sm transition-all duration-300 min-w-[220px] hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5 text-slate-700 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              Continue with GitHub
            </Link>
          </div>
          <p className="text-sm text-slate-500 dark:text-gray-500 mt-8">
            By joining, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-black py-20 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            {/* Logo & About */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 relative flex items-center justify-center">
                   <Image src="/assets/Logo.png" alt="Fade Logo" fill className="object-contain" />
                </div>
                <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">FADE</span>
              </div>
              <p className="text-slate-600 dark:text-gray-500 text-sm leading-relaxed">
                Digital impermanence for the modern soul. Based in the cloud, drifting everywhere.
              </p>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-slate-900 dark:text-white font-bold mb-6 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-4 text-slate-600 dark:text-gray-500 text-sm">
                <li><Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About</Link></li>
                <li><Link href="/manifesto" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Manifesto</Link></li>
                <li><Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-slate-900 dark:text-white font-bold mb-6 text-sm uppercase tracking-wider">Legal</h4>
              <ul className="space-y-4 text-slate-600 dark:text-gray-500 text-sm">
                <li><Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms</Link></li>
                <li><Link href="/cookies" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-slate-900 dark:text-white font-bold mb-6 text-sm uppercase tracking-wider">Social</h4>
              <ul className="space-y-4 text-slate-600 dark:text-gray-500 text-sm">
                <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Twitter</Link></li>
                <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Instagram</Link></li>
                <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Discord</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between text-slate-500 dark:text-gray-600 text-sm">
            <p>© 2024 Fade Inc. All rights reserved.</p>
            <p className="mt-2 md:mt-0 italic">Nothing lasts forever.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
