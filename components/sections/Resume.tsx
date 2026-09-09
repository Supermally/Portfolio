"use client";

import React from "react";
import { Download, Award, GraduationCap, Code, Wrench, Languages, Briefcase, CreditCard, CheckCircle2 } from "lucide-react";

export function Resume() {
  const experiences = [
    {
      period: "APRIL 2026 — PRESENT",
      role: "SYEP Site Monitor",
      organization: "Good Shepherd Services",
      location: "Bronx, NY",
      type: "WORKFORCE OPERATIONS & COMPLIANCE",
      points: [
        "Manage participant, worksite, and program records and conduct regular worksite visits to monitor operations and address concerns.",
        "Process weekly participant payroll and maintain accurate attendance, payroll, and program documentation.",
        "Coordinate with worksites, program staff, and partners while assisting with youth events and activities.",
        "Use Microsoft 365, ADP Payroll, and NYC DYCD systems for program administration and data management.",
      ],
    },
    {
      period: "DEC 2025 — APRIL 2026",
      role: "Work, Learn & Grow (WLG) Site Monitor",
      organization: "Good Shepherd Services",
      location: "Bronx, NY",
      type: "PROGRAM MANAGEMENT & PAYROLL",
      points: [
        "Supported day-to-day operations across WLG, SYEP, and school-based internship worksites.",
        "Processed weekly ADP payroll for program staff and high school student interns.",
        "Posted employment and internship opportunities and conducted outreach to prospective worksites and organizational partners.",
        "Conducted worksite visits, maintained records, and supported program events and activities using Microsoft 365, ADP, and DYCD.",
      ],
    },
    {
      period: "DEC 2024 — AUGUST 2025",
      role: "SYEP Site Monitor Intern",
      organization: "Good Shepherd Services",
      location: "Bronx, NY",
      type: "ADMINISTRATIVE OPERATIONS",
      points: [
        "Provided administrative support through records management, document organization, office coordination, and participant communications.",
        "Assisted with weekly program payroll and maintained related documentation.",
        "Supported event coordination and daily program operations using Microsoft 365.",
      ],
    },
    {
      period: "JULY 2024 — AUGUST 2024",
      role: "Research Intern, DREAM-High Program",
      organization: "Columbia University",
      location: "New York, NY",
      type: "DATA ANALYSIS & CLOUD COMPUTING",
      points: [
        "Analyzed and visualized genomic, clinical, and physical data from breast cancer cells using R/RStudio in a cloud computing environment.",
        "Applied programming, statistical analysis, and data visualization techniques to explore biological datasets.",
      ],
    },
    {
      period: "OCT 2024 — DEC 2024",
      role: "Farm Worker Intern",
      organization: "Teens for Food Justice",
      location: "Bronx, NY",
      type: "HYDROPONICS & PROCESS OPTIMIZATION",
      points: [
        "Performed seeding, transplanting, harvesting, cleaning, crop-yield logging, and plant-health monitoring.",
        "Developed recipes using harvested ingredients while minimizing waste and collaborated with team members to improve workflow.",
      ],
    },
    {
      period: "JULY 2024 — AUGUST 2024",
      role: "Retail Associate",
      organization: "Five Below",
      location: "New York, NY",
      type: "OPERATIONS & CUSTOMER SERVICE",
      points: [
        "Provided customer service while receiving, organizing, stocking, and maintaining merchandise and sales-floor operations.",
        "Demonstrated communication, problem-solving, and multitasking skills in a fast-paced environment.",
      ],
    },
  ];

  const certifications = [
    {
      title: "IT Specialist — HTML and CSS",
      issuer: "Certiport",
      date: "February 2024",
      badge: "CERTIPORT",
    },
    {
      title: "CompTIA IT Fundamentals+ (ITF+)",
      issuer: "CompTIA",
      date: "2024",
      badge: "COMPTIA",
    },
  ];

  const skillCategories = [
    {
      category: "Programming & Web",
      skills: ["Python", "C++", "R", "SQL", "MySQL", "HTML5", "CSS", "JavaScript", "DHTML"],
    },
    {
      category: "Software & Tools",
      skills: ["Microsoft 365", "Excel", "ADP Payroll", "RStudio", "Git", "GitHub", "AutoCAD", "NYC DYCD"],
    },
    {
      category: "Engineering & Analysis",
      skills: ["Data Analysis", "Computer Engineering", "Web Design", "Statistical Modeling", "Worksite Compliance"],
    },
  ];

  return (
    <section id="resume" className="py-20 border-b border-zinc-300 bg-[#f4efe6]/60 relative select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Fare Card Signage Header */}
        <div className="border-b-2 border-zinc-950 pb-4 mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-zinc-600 uppercase tracking-widest mb-1.5">
              <CreditCard className="w-3.5 h-3.5 text-[#ff6319]" />
              <span>OFFICIAL SERVICE DOSSIER // SECTION 04</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight font-sans">
              Transit Authority Fare Card &amp; Dossier
            </h2>
          </div>

          <a
            href="/assets/resume-placeholder.pdf"
            download="Malachi_McDonald_Resume.pdf"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl font-sans text-xs font-black transition-all shadow-md group cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#ff6319] group-hover:scale-110 transition-transform" />
            <span>DOWNLOAD OFFICIAL RESUME (PDF)</span>
          </a>
        </div>

        {/* Top Summary Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-zinc-900 shadow-xl mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full bg-[#ff6319] shadow-sm" />
              <h3 className="font-sans font-black text-xl text-zinc-950">Malachi McDonald</h3>
              <span className="font-mono text-xs text-zinc-500 font-bold">Brooklyn, NY</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs font-extrabold uppercase">
              ACTIVE CANDIDATE
            </span>
          </div>
          <p className="text-sm sm:text-base text-zinc-700 font-sans leading-relaxed">
            Site Monitor with experience managing participant records, worksite compliance, and payroll processing for NYC DYCD-administered youth workforce programs. Skilled in Microsoft 365, Excel, and ADP Payroll, with a background in computer engineering, programming, and cloud-based data analysis.
          </p>
        </div>

        {/* 2-Column Main Layout: Timeline (Left) + Education & Skills (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 Cols): Experience Timeline */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
              <Briefcase className="w-4 h-4 text-[#ff6319]" />
              <span>Professional Experience &amp; Research</span>
            </div>

            <div className="space-y-4">
              {experiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-zinc-300 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-sans font-black text-lg text-zinc-950">
                        {exp.role}
                      </h4>
                      <div className="text-xs font-bold text-[#0039a6] font-sans">
                        {exp.organization} • {exp.location}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-zinc-100 border border-zinc-200 font-mono text-[11px] font-bold text-zinc-700">
                      {exp.period}
                    </span>
                  </div>

                  <div className="text-[10px] font-mono font-bold text-amber-800 uppercase tracking-wide mb-3">
                    {exp.type}
                  </div>

                  <ul className="space-y-1.5 text-xs text-zinc-700 font-sans leading-relaxed">
                    {exp.points.map((pt, ptIdx) => (
                      <li key={ptIdx} className="flex items-start gap-2">
                        <span className="text-[#ff6319] font-black mt-0.5">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (5 Cols): Education, Certifications & Skills */}
          <div className="lg:col-span-5 space-y-6">
            {/* Education Card */}
            <div className="p-6 rounded-2xl bg-white border border-zinc-300 shadow-sm space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-zinc-500 uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-[#0039a6]" />
                <span>Education</span>
              </div>
              <div>
                <h4 className="font-sans font-black text-base text-zinc-950">
                  DeWitt Clinton High School
                </h4>
                <div className="text-xs font-bold text-zinc-600 font-sans mt-0.5">
                  Computer &amp; Information Sciences and Support Services
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 font-semibold mt-2 pt-2 border-t border-zinc-200">
                  <span>Bronx, NY</span>
                  <span className="font-bold text-zinc-900">Graduation: 2025</span>
                </div>
              </div>
            </div>

            {/* Certifications Card */}
            <div className="p-6 rounded-2xl bg-white border border-zinc-300 shadow-sm space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-zinc-500 uppercase tracking-wider">
                <Award className="w-4 h-4 text-[#ff6319]" />
                <span>Verified Certifications</span>
              </div>

              <div className="space-y-3">
                {certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start justify-between gap-3"
                  >
                    <div>
                      <h5 className="font-sans font-extrabold text-xs text-zinc-950">
                        {cert.title}
                      </h5>
                      <div className="text-[11px] font-mono text-zinc-500 font-semibold mt-0.5">
                        Issued by {cert.issuer} ({cert.date})
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-zinc-200 text-zinc-800 text-[9px] font-mono font-bold shrink-0">
                      {cert.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Skills & Tools Matrix */}
            <div className="p-6 rounded-2xl bg-white border border-zinc-300 shadow-sm space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-zinc-500 uppercase tracking-wider">
                <Code className="w-4 h-4 text-emerald-600" />
                <span>Technical Skills &amp; Tools</span>
              </div>

              <div className="space-y-4">
                {skillCategories.map((cat, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="text-[11px] font-mono font-bold text-zinc-500 uppercase">
                      {cat.category}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-1 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-800 font-mono text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Languages */}
                <div className="space-y-1.5 pt-2 border-t border-zinc-200">
                  <div className="text-[11px] font-mono font-bold text-zinc-500 uppercase flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Languages</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-sans text-zinc-700">
                    <span className="px-2.5 py-1 rounded-md bg-zinc-50 border border-zinc-200 font-medium">
                      <strong>English</strong> (Native)
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-zinc-50 border border-zinc-200 font-medium">
                      <strong>German</strong> (Limited working proficiency)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
