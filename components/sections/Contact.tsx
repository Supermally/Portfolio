"use client";

import React, { useState } from "react";
import { Mail, Github, Linkedin, ExternalLink, ArrowUpRight, Copy, Check, Compass } from "lucide-react";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const email = "malachimcd1@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const platforms = [
    {
      id: "platform-github",
      label: "PLATFORM A // CODE REPOSITORIES",
      channel: "GitHub",
      handle: "@Supermally", // PLACEHOLDER
      link: "https://github.com/Supermally",
      desc: "Hardware HDL, firmware kernels, and simulation sources.",
      icon: Github,
      color: "#ff6319",
    },
    {
      id: "platform-linkedin",
      label: "PLATFORM B // PROFESSIONAL NETWORK",
      channel: "LinkedIn",
      handle: "in/malachi-mcdonald-546ba4209",
      link: "https://www.linkedin.com/in/malachi-mcdonald-546ba4209/",
      desc: "Engineering career history and research affiliations.",
      icon: Linkedin,
      color: "#0039a6",
    },
  ];

  return (
    <section id="contact" className="py-20 bg-[#121214] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Porcelain Enamel Exit Sign Header */}
        <div className="border-b border-zinc-800 pb-4 mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#00933c] uppercase tracking-widest mb-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>WAYFINDING DIRECTORY // SECTION 05</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans">
              Station Wayfinding &amp; Platform Exits
            </h2>
          </div>
          <p className="text-zinc-400 text-xs sm:text-sm font-sans max-w-md">
            Direct dispatch channels and external repository platforms. Connect for hardware collaborations or technical inquiries.
          </p>
        </div>

        {/* Main Station Dispatch Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          {/* Left Column: Direct Electronic Dispatch / Email */}
          <div className="lg:col-span-6 rounded-3xl border border-zinc-800 bg-zinc-950 p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold w-fit">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>EXIT 01 // DIRECT DISPATCH TERMINAL</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">
                Send Direct Transmission
              </h3>
              <p className="text-zinc-400 text-sm font-sans leading-relaxed">
                Open for engineering roles, technical advisory on hardware/aerospace programs, and systems architecture inquiries.
              </p>

              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#ff6319] flex-shrink-0" />
                  <span className="font-mono text-sm sm:text-base font-bold text-white">
                    {email}
                  </span>
                </div>

                <button
                  onClick={handleCopyEmail}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-sans text-xs font-bold transition-colors flex items-center gap-1.5"
                  title="Copy email address"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPY</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-800 mt-6 flex items-center justify-between font-mono text-xs text-zinc-500">
              <span>RESPONSE WINDOW: 24–48 HRS</span>
              <span>{"// PGP KEY ON REQUEST"}</span>
            </div>
          </div>

          {/* Right Column: Platform Links */}
          <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              return (
                <a
                  key={platform.id}
                  href={platform.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-6 rounded-3xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-900/90 transition-all group flex flex-col justify-between space-y-3 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="font-mono text-xs font-bold tracking-wider uppercase px-2.5 py-0.5 rounded text-white"
                      style={{ backgroundColor: platform.color }}
                    >
                      {platform.label}
                    </span>
                    <ArrowUpRight className="w-5 h-5 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-white font-sans flex items-center gap-2">
                      <Icon className="w-5 h-5 text-zinc-300" />
                      <span>{platform.channel}</span>
                      <span className="font-mono text-xs font-normal text-zinc-400">
                        ({platform.handle})
                      </span>
                    </h4>
                    <p className="text-xs text-zinc-400 font-sans mt-1">
                      {platform.desc}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Subway System Footer */}
        <div className="pt-10 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4 font-sans text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-mono">GRAND CENTRAL SYSTEM // ALL ROUTES OPERATING NORMALLY</span>
          </div>

          <div className="font-mono text-zinc-600">
            © 2026 GRAND CENTRAL • BUILT WITH NEXT.JS &amp; GSAP
          </div>
        </div>
      </div>
    </section>
  );
}
