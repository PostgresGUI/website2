"use client";

import Image from "next/image";
import { type CSSProperties, useEffect, useState } from "react";

const screenshots = {
  intro: "/screenshots/intro.jpg",
  connections: "/screenshots/connections.jpg",
  folders: "/screenshots/folders.jpg",
  editRow: "/screenshots/edit-row.jpg",
  export: "/screenshots/export.jpg",
};

const valueProps = [
  {
    glowPosition: "18% 14%",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
      </svg>
    ),
    title: "Native",
    desc: "Written in Swift. No Electron.",
  },
  {
    glowPosition: "82% 20%",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: "Lightweight",
    desc: "32.8 MB. Starts instantly.",
  },
  {
    glowPosition: "28% 78%",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3C7.03 3 3 7.03 3 12c0 3.98 2.58 7.35 6.16 8.54.45.08.62-.19.62-.43v-1.52c-2.5.54-3.03-1.06-3.03-1.06-.4-1.03-.98-1.31-.98-1.31-.8-.55.06-.54.06-.54.89.06 1.36.91 1.36.91.79 1.35 2.08.96 2.58.73.08-.57.31-.96.56-1.18-2-.23-4.11-1-4.11-4.46 0-.99.35-1.8.92-2.44-.09-.23-.4-1.16.09-2.42 0 0 .75-.24 2.47.93A8.52 8.52 0 0 1 12 7.32c.76 0 1.53.1 2.25.3 1.72-1.17 2.47-.93 2.47-.93.49 1.26.18 2.19.09 2.42.57.64.92 1.45.92 2.44 0 3.47-2.11 4.22-4.12 4.46.32.28.61.83.61 1.67v2.48c0 .24.16.52.63.43A9 9 0 0 0 21 12c0-4.97-4.03-9-9-9z" />
      </svg>
    ),
    title: "Open Source",
    desc: "Build it yourself. Have fun.",
  },
];

const featurePattern = {
  bg: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1.5' fill='%23a1a1aa' fill-opacity='0.3'/%3E%3C/svg%3E")`,
  size: "20px 20px",
};

const features = [
  {
    desc: "Work across multiple queries at once. Each tab keeps its own connection, results, and scroll position — so you can reference one query while writing another without losing your place.",
    screenshot: "/screenshots/tabs.jpg",
    alt: "Multiple query tabs open side by side",
    pattern: featurePattern,
  },
  {
    desc: "Add your local dev database, a staging server over SSH, and production — all in one place. Connections are saved securely and ready to go whenever you open the app.",
    screenshot: screenshots.connections,
    alt: "Database connections manager with multiple servers",
    pattern: featurePattern,
  },
  {
    desc: "Keep your queries tidy. Save the ones you use often, group them into folders by project or topic, and find what you need instantly instead of digging through your notes.",
    screenshot: screenshots.folders,
    alt: "Saved queries organized in folders",
    pattern: featurePattern,
  },
  {
    desc: "Click into any row to view and edit its values directly. No need to write UPDATE statements for quick fixes — just change the field and save.",
    screenshot: screenshots.editRow,
    alt: "Inline row editing with editable fields",
    pattern: featurePattern,
  },
  {
    desc: "Preview your results as a table or raw JSON, then export to CSV with one click. Filter tables by schema to cut through the noise in large databases.",
    screenshot: screenshots.export,
    alt: "Query results with export to CSV option",
    pattern: featurePattern,
  },
];

const comparisons = [
  { vs: "pgAdmin", reason: "Native Mac app, not Electron" },
  { vs: "DBeaver", reason: "Lightweight, not JVM-based" },
  { vs: "Postico", reason: "Free and open source" },
  { vs: "TablePlus", reason: "PostgreSQL-focused, no bloat" },
];

export default function Home() {
  const [stars, setStars] = useState<string>("000");

  useEffect(() => {
    fetch("https://api.github.com/repos/postgresgui/postgresgui")
      .then((res) => res.json())
      .then((data) => {
        if (data.stargazers_count) setStars(Number(data.stargazers_count).toLocaleString());
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll(".reveal, .feature-reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="relative z-20 px-6 py-5">
        <div className="max-w-7xl mx-auto flex justify-end">
          <a
            href="/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            Blog ↗
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-1 pb-24 overflow-hidden">
        <div className="gradient-orb top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="mb-8 w-32 h-32 rounded-[22%] bg-gradient-to-b from-white to-[#e8e8e8] shadow-[0_6px_20px_rgba(0,0,0,0.1),0_0_0_0.5px_rgba(0,0,0,0.06)] flex items-center justify-center overflow-hidden">
            <Image
              src="/logo.png"
              alt="Postgres Client for Mac Elephant Logo"
              width={88}
              height={88}
            />
          </div>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.1] mb-4">
            A lightweight<br />PostgreSQL<br />client for Mac
          </h1>
          <p className="text-base sm:text-lg font-mono text-accent tracking-wider uppercase mb-10">
            Beautiful. Fast. Open Source.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <a
              href="https://apps.apple.com/us/app/postgresgui/id6756467181"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-[#333] shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.1)]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Download on the App Store
            </a>
            <a
              href="https://github.com/postgresgui/postgresgui"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-border text-base font-semibold text-foreground transition-all hover:bg-surface overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] bg-gradient-to-b from-white to-[#f5f5f5]"
            >
              <span className="inline-flex items-center gap-2 px-6 py-3.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Star on GitHub
              </span>
              <span className="inline-flex items-center gap-1 px-5 py-3.5 border-l border-border text-sm font-mono">
                ⭐ <span style={{ fontFamily: "monospace" }}>{stars}</span>
              </span>
            </a>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto hero-float">
          <div className="macos-window">
            <Image
              src={screenshots.intro}
              alt="Query Editor"
              width={1440}
              height={900}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="px-6 py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
          {valueProps.map((prop, i) => (
            <div
              key={prop.title}
              className={`reveal reveal-delay-${i + 1} value-card group relative overflow-hidden rounded-[30px] px-8 py-9 sm:px-10 sm:py-10`}
              style={{ "--value-card-glow-position": prop.glowPosition } as CSSProperties}
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
              <div className="relative z-10 flex h-full flex-col items-start text-left">
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#eff6ff] via-white to-[#dbeafe] text-accent shadow-[0_16px_30px_rgba(37,99,235,0.16)] ring-1 ring-[#bfdbfe]">
                  {prop.icon}
                </div>
                <h3 className="text-2xl font-semibold tracking-tight sm:text-[1.9rem]">
                  {prop.title}
                </h3>
                <p className="mt-4 max-w-[22ch] text-lg leading-8 text-muted">
                  {prop.desc}
                </p>
                <div className="mt-auto pt-8">
                  <div className="h-1.5 w-20 rounded-full bg-gradient-to-r from-accent via-[#60a5fa] to-[#c4b5fd] opacity-80 transition-all duration-500 group-hover:w-28" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features-wrap px-6 py-28">
        <div className="max-w-7xl mx-auto flex flex-col gap-44">
          {features.map((feature, i) => {
            const isReverse = i % 2 !== 0;
            return (
              <div
                key={i}
                className={`feature-reveal${isReverse ? " reverse" : ""} feature-glass`}
              >
                <div
                  className={`flex flex-col gap-8 items-center lg:items-stretch lg:gap-0 ${
                    isReverse ? "lg:flex-row-reverse" : "lg:flex-row"
                  }`}
                >
                  <div className={`feature-text lg:w-[30%] flex flex-col justify-end text-center lg:text-left order-last lg:order-none`}>
                    <div
                      className="feature-decoration hidden lg:flex flex-1 w-full overflow-hidden"
                      style={{
                        backgroundImage: feature.pattern.bg,
                        backgroundSize: feature.pattern.size,
                        backgroundRepeat: "repeat",
                      }}
                    />
                    <div className={`${isReverse ? "lg:pl-8" : "lg:pr-8"} pt-6`}>
                      <p className="text-xl leading-relaxed">
                        {feature.desc}
                      </p>
                      <a
                        href="https://apps.apple.com/us/app/postgresgui/id6756467181"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-gradient-to-b from-white to-[#f5f5f5] px-5 py-2 text-sm font-semibold text-foreground transition-all hover:bg-surface shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] mt-5 self-center lg:self-start"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                        </svg>
                        Download on the App Store
                      </a>
                    </div>
                  </div>
                  <div className="feature-image lg:w-[70%]">
                    <div className="macos-window">
                      <Image
                        src={feature.screenshot}
                        alt={feature.alt}
                        width={1440}
                        height={900}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison */}
      <section className="px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="reveal">
            <span className="text-sm font-mono text-accent uppercase tracking-widest">
              Compare
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-4 mb-12">
              Why choose us?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {comparisons.map((item, i) => (
              <div
                key={item.vs}
                className={`reveal reveal-delay-${i + 1} rounded-xl border border-border bg-surface p-6 text-left`}
              >
                <p className="text-sm font-mono text-muted mb-2">
                  vs {item.vs}
                </p>
                <p className="text-foreground text-lg font-medium">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* CTA */}
      <section className="px-6 py-32">
        <div className="reveal max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Get Started
          </h2>
          <a
            href="https://apps.apple.com/us/app/postgresgui/id6756467181"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-10 py-4 text-base font-semibold text-white transition-colors hover:bg-[#333]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Download on the App Store
          </a>
          <a
            href="https://github.com/postgresgui/postgresgui"
            target="_blank"
            rel="noopener noreferrer"
            className="text-base text-muted hover:text-foreground transition-colors flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            View on GitHub
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <p>Made for Postgres developers</p>
          <div className="flex items-center gap-6">
            <a
              href="/blog"
              className="hover:text-foreground transition-colors"
            >
              Blog
            </a>
            <a
              href="https://github.com/postgresgui/postgresgui"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
