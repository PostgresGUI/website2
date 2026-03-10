import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  openGraph: {
    type: "article",
    siteName: "postgresmac.com",
  },
};

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-[720px] mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 text-foreground hover:text-accent transition-colors"
          >
            <Image src="/logo.png" alt="Postgres Client for Mac Elephant Logo" width={28} height={28} />
          </Link>
          <nav className="flex items-center gap-5">
            <Link
              href="/blog"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Home
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 px-6 py-16">
        <div className="max-w-[720px] mx-auto">{children}</div>
      </main>

      <footer className="border-t border-border px-6 py-10">
        <div className="max-w-[720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <p>Made for Postgres developers</p>
          <div className="flex items-center gap-6">
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
