import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — PostgresGUI",
  description:
    "Articles about PostgreSQL tools, workflows, and best practices for Mac developers.",
  alternates: {
    canonical: "/blog",
  },
};

const posts = [
  {
    slug: "pgadmin-alternatives-mac",
    title: "The Best pgAdmin Alternatives for Mac",
  },
  {
    slug: "ssh-tunnel-postgres",
    title: "SSH Tunneling to PostgreSQL: A Complete CLI Tutorial",
  },
];

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
            className="block py-2.5 text-foreground hover:text-accent transition-colors"
          >
            {post.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
