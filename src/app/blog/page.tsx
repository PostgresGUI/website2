import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — Postgres Client for Mac",
  description:
    "Articles about PostgreSQL tools, workflows, and best practices for Mac developers.",
  alternates: {
    canonical: "/blog",
  },
};

const posts = [
  {
    slug: "explain-analyze-postgres",
    title:
      "EXPLAIN / EXPLAIN ANALYZE — The Complete Guide to PostgreSQL Query Plans",
    date: new Date("2026-03-15"),
  },
  {
    slug: "postico-vs-tableplus-vs-dbeaver-vs-datagrip",
    title:
      "Postico vs TablePlus vs DBeaver vs DataGrip: The Definitive 2026 Database Client Showdown",
    date: new Date("2026-03-10"),
  },
  {
    slug: "ssl-verify-full-for-rds-postgresql-on-mac",
    title: "SSL verify-full for RDS PostgreSQL on macOS",
    date: new Date("2026-03-10"),
  },
  {
    slug: "best-postgresql-client-mac",
    title: "Best PostgreSQL Client for Mac (2026)",
    date: new Date("2026-03-09"),
  },
  {
    slug: "ssh-tunnel-postgres",
    title: "SSH Tunneling to PostgreSQL: A Complete CLI Tutorial",
    date: new Date("2026-03-09"),
  },
  {
    slug: "pgadmin-alternatives-mac",
    title: "The Best pgAdmin Alternatives for Mac",
    date: new Date("2026-03-09"),
  },
];

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function BlogIndex() {
  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight mb-6">
        Blog
      </h1>
      <div className="divide-y divide-border">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="flex items-center justify-between py-2.5 text-foreground hover:text-accent transition-colors"
          >
            <span className="truncate">{post.title}</span>
            <span className="text-sm text-muted shrink-0 ml-4">{formatDate(post.date)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
