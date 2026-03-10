"use client";

export type TocItem = {
  id: string;
  label: string;
};

export default function TableOfContents({ items }: { items: TocItem[] }) {
  return (
    <nav className="hidden xl:block fixed w-56 text-sm top-34" style={{ right: "calc(50% + 400px)" }}>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
          On this page
        </p>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                }}
                className="block text-muted hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
    </nav>
  );
}
