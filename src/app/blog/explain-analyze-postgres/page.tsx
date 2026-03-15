import type { Metadata } from "next";
import TableOfContents from "../table-of-contents";

const toc = [
  { id: "what-is-a-query-plan", label: "What is a query plan?" },
  { id: "explain-vs-analyze", label: "EXPLAIN vs. EXPLAIN ANALYZE" },
  { id: "full-syntax", label: "Full syntax" },
  { id: "reading-the-output", label: "Reading the output" },
  { id: "scan-node-types", label: "Scan node types" },
  { id: "join-node-types", label: "Join node types" },
  { id: "patterns-to-recognize", label: "Patterns to recognize" },
  { id: "the-buffers-option", label: "The BUFFERS option" },
  { id: "output-formats", label: "Output formats" },
  { id: "companion-tools", label: "Companion tools" },
  { id: "practical-checklist", label: "Practical checklist" },
];

export const metadata: Metadata = {
  title:
    "EXPLAIN / EXPLAIN ANALYZE — The Complete Guide to PostgreSQL Query Plans",
  description:
    "Learn how to read PostgreSQL query plans with EXPLAIN and EXPLAIN ANALYZE. Covers scan types, join algorithms, BUFFERS, row estimates, and a practical checklist for diagnosing slow queries.",
  alternates: {
    canonical: "/blog/explain-analyze-postgres",
  },
  openGraph: {
    title:
      "EXPLAIN / EXPLAIN ANALYZE — The Complete Guide to PostgreSQL Query Plans",
    description:
      "Learn how to read PostgreSQL query plans with EXPLAIN and EXPLAIN ANALYZE. Covers scan types, join algorithms, BUFFERS, row estimates, and a practical checklist for diagnosing slow queries.",
    url: "https://postgresmac.com/blog/explain-analyze-postgres",
  },
};

/* ── SVG Illustrations ── */

function QueryPlanTreeSvg() {
  return (
    <figure className="my-8">
      <svg
        viewBox="0 0 600 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[560px] mx-auto"
        role="img"
        aria-label="Query plan tree showing Sort at the root, Hash Join in the middle, with Seq Scan on orders and Hash of Seq Scan on customers as leaf nodes"
      >
        {/* Connection lines */}
        <line x1="300" y1="68" x2="300" y2="118" stroke="#D1D5DB" strokeWidth="2" strokeDasharray="6 4" />
        <line x1="300" y1="178" x2="168" y2="228" stroke="#D1D5DB" strokeWidth="2" strokeDasharray="6 4" />
        <line x1="300" y1="178" x2="432" y2="228" stroke="#D1D5DB" strokeWidth="2" strokeDasharray="6 4" />
        <line x1="432" y1="268" x2="432" y2="298" stroke="#D1D5DB" strokeWidth="2" strokeDasharray="6 4" />

        {/* Root: Sort */}
        <rect x="210" y="24" width="180" height="44" rx="8" fill="#2563EB" />
        <text x="300" y="52" textAnchor="middle" fill="white" fontSize="15" fontWeight="600" fontFamily="system-ui, sans-serif">Sort</text>

        {/* Hash Join */}
        <rect x="210" y="118" width="180" height="44" rx="8" fill="#2563EB" fillOpacity="0.82" />
        <text x="300" y="146" textAnchor="middle" fill="white" fontSize="15" fontWeight="600" fontFamily="system-ui, sans-serif">Hash Join</text>

        {/* Seq Scan orders */}
        <rect x="68" y="228" width="200" height="44" rx="8" fill="#F0F0F0" stroke="#D1D5DB" strokeWidth="1.5" />
        <text x="168" y="255" textAnchor="middle" fill="#111" fontSize="13" fontWeight="500" fontFamily="system-ui, sans-serif">Seq Scan on orders</text>

        {/* Hash */}
        <rect x="352" y="228" width="160" height="44" rx="8" fill="#F0F0F0" stroke="#D1D5DB" strokeWidth="1.5" />
        <text x="432" y="255" textAnchor="middle" fill="#111" fontSize="13" fontWeight="500" fontFamily="system-ui, sans-serif">Hash</text>

        {/* Seq Scan customers */}
        <rect x="332" y="298" width="200" height="44" rx="8" fill="#F0F0F0" stroke="#D1D5DB" strokeWidth="1.5" />
        <text x="432" y="325" textAnchor="middle" fill="#111" fontSize="13" fontWeight="500" fontFamily="system-ui, sans-serif">Seq Scan on customers</text>

        {/* Flow arrows */}
        <text x="560" y="50" textAnchor="end" fill="#6B7280" fontSize="11" fontFamily="system-ui, sans-serif">root (last)</text>
        <text x="560" y="330" textAnchor="end" fill="#6B7280" fontSize="11" fontFamily="system-ui, sans-serif">leaf (first)</text>
        <line x1="556" y1="60" x2="556" y2="310" stroke="#6B7280" strokeWidth="1" markerEnd="url(#arrowDown)" />
        <line x1="556" y1="310" x2="556" y2="60" stroke="#6B7280" strokeWidth="1" markerEnd="url(#arrowUp)" />
        <defs>
          <marker id="arrowDown" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" fill="#6B7280" />
          </marker>
          <marker id="arrowUp" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M6,0 L0,3 L6,6" fill="#6B7280" />
          </marker>
        </defs>
        <text x="572" y="192" textAnchor="middle" fill="#6B7280" fontSize="10" fontFamily="system-ui, sans-serif" transform="rotate(-90, 572, 192)">execution flow</text>
      </svg>
      <figcaption className="text-center text-sm text-muted mt-3">
        A query plan is a tree. Deepest nodes execute first; the root returns the final result.
      </figcaption>
    </figure>
  );
}

function ScanTypesSvg() {
  return (
    <figure className="my-8">
      <svg
        viewBox="0 0 680 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[640px] mx-auto"
        role="img"
        aria-label="Comparison of three scan types: Sequential Scan reads every row, Index Scan jumps directly to matching rows via B-tree, Bitmap Scan collects pointers then fetches in order"
      >
        {/* ── Seq Scan ── */}
        <text x="108" y="20" textAnchor="middle" fill="#111" fontSize="13" fontWeight="600" fontFamily="system-ui, sans-serif">Seq Scan</text>
        {/* Table rows */}
        {[0,1,2,3,4,5,6,7].map((i) => (
          <g key={`seq-${i}`}>
            <rect x={28 + i * 20} y="36" width="18" height="28" rx="2" fill={i === 2 || i === 5 ? "#2563EB" : "#E5E5E5"} stroke={i === 2 || i === 5 ? "#1D4ED8" : "#D1D5DB"} strokeWidth="1" />
            {i === 2 || i === 5 ? <text x={37 + i * 20} y="54" textAnchor="middle" fill="white" fontSize="9" fontWeight="600" fontFamily="system-ui, sans-serif">&#10003;</text> : null}
          </g>
        ))}
        {/* Arrow sweeping across all rows */}
        <path d="M28,80 Q108,96 188,80" stroke="#2563EB" strokeWidth="1.5" fill="none" markerEnd="url(#blueArrow)" />
        <text x="108" y="108" textAnchor="middle" fill="#6B7280" fontSize="10" fontFamily="system-ui, sans-serif">reads every row</text>
        <text x="108" y="122" textAnchor="middle" fill="#6B7280" fontSize="10" fontFamily="system-ui, sans-serif">applies filter</text>

        {/* ── Index Scan ── */}
        <text x="340" y="20" textAnchor="middle" fill="#111" fontSize="13" fontWeight="600" fontFamily="system-ui, sans-serif">Index Scan</text>
        {/* B-tree mini */}
        <rect x="320" y="36" width="40" height="20" rx="4" fill="#2563EB" fillOpacity="0.15" stroke="#2563EB" strokeWidth="1" />
        <text x="340" y="50" textAnchor="middle" fill="#2563EB" fontSize="8" fontWeight="600" fontFamily="system-ui, sans-serif">B-tree</text>
        <line x1="340" y1="56" x2="310" y2="70" stroke="#2563EB" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="340" y1="56" x2="370" y2="70" stroke="#2563EB" strokeWidth="1" strokeDasharray="3 2" />
        <rect x="296" y="70" width="28" height="14" rx="3" fill="#2563EB" fillOpacity="0.1" stroke="#2563EB" strokeWidth="0.8" />
        <rect x="356" y="70" width="28" height="14" rx="3" fill="#2563EB" fillOpacity="0.1" stroke="#2563EB" strokeWidth="0.8" />
        {/* Table rows */}
        {[0,1,2,3,4,5,6,7].map((i) => (
          <g key={`idx-${i}`}>
            <rect x={260 + i * 20} y="100" width="18" height="28" rx="2" fill={i === 2 ? "#2563EB" : "#F0F0F0"} stroke={i === 2 ? "#1D4ED8" : "#E5E5E5"} strokeWidth="1" />
          </g>
        ))}
        {/* Direct arrow from index to matching row */}
        <path d="M310,84 L310,84 Q306,92 308,100" stroke="#2563EB" strokeWidth="1.5" fill="none" markerEnd="url(#blueArrow)" />
        <text x="340" y="148" textAnchor="middle" fill="#6B7280" fontSize="10" fontFamily="system-ui, sans-serif">jumps to matching</text>
        <text x="340" y="162" textAnchor="middle" fill="#6B7280" fontSize="10" fontFamily="system-ui, sans-serif">rows via index</text>

        {/* ── Bitmap Scan ── */}
        <text x="568" y="20" textAnchor="middle" fill="#111" fontSize="13" fontWeight="600" fontFamily="system-ui, sans-serif">Bitmap Scan</text>
        {/* Phase 1: bitmap */}
        <text x="568" y="38" textAnchor="middle" fill="#6B7280" fontSize="9" fontFamily="system-ui, sans-serif">1. build bitmap</text>
        {[0,1,2,3,4,5,6,7].map((i) => (
          <g key={`bm-${i}`}>
            <rect x={488 + i * 20} y="46" width="18" height="16" rx="2" fill={i === 1 || i === 4 || i === 5 ? "#2563EB" : "#F0F0F0"} stroke={i === 1 || i === 4 || i === 5 ? "#1D4ED8" : "#E5E5E5"} strokeWidth="1" />
            <text x={497 + i * 20} y="58" textAnchor="middle" fill={i === 1 || i === 4 || i === 5 ? "white" : "#9CA3AF"} fontSize="8" fontWeight="500" fontFamily="system-ui, sans-serif">{i === 1 || i === 4 || i === 5 ? "1" : "0"}</text>
          </g>
        ))}
        {/* Phase 2: heap fetch */}
        <text x="568" y="84" textAnchor="middle" fill="#6B7280" fontSize="9" fontFamily="system-ui, sans-serif">2. fetch in order</text>
        {[0,1,2,3,4,5,6,7].map((i) => (
          <g key={`bmh-${i}`}>
            <rect x={488 + i * 20} y="92" width="18" height="28" rx="2" fill={i === 1 || i === 4 || i === 5 ? "#2563EB" : "#F0F0F0"} stroke={i === 1 || i === 4 || i === 5 ? "#1D4ED8" : "#E5E5E5"} strokeWidth="1" />
          </g>
        ))}
        <text x="568" y="140" textAnchor="middle" fill="#6B7280" fontSize="10" fontFamily="system-ui, sans-serif">collects pointers, then</text>
        <text x="568" y="154" textAnchor="middle" fill="#6B7280" fontSize="10" fontFamily="system-ui, sans-serif">fetches in physical order</text>

        {/* Selectivity scale at bottom */}
        <line x1="40" y1="210" x2="640" y2="210" stroke="#E5E5E5" strokeWidth="1.5" />
        <circle cx="108" cy="210" r="5" fill="#2563EB" />
        <circle cx="340" cy="210" r="5" fill="#2563EB" />
        <circle cx="568" cy="210" r="5" fill="#2563EB" />
        <text x="40" y="236" fill="#6B7280" fontSize="10" fontFamily="system-ui, sans-serif">Low selectivity</text>
        <text x="640" y="236" textAnchor="end" fill="#6B7280" fontSize="10" fontFamily="system-ui, sans-serif">High selectivity</text>
        <text x="340" y="250" textAnchor="middle" fill="#9CA3AF" fontSize="10" fontFamily="system-ui, sans-serif">&#8592; % of table rows that match &#8594;</text>
        <text x="108" y="226" textAnchor="middle" fill="#111" fontSize="10" fontWeight="500" fontFamily="system-ui, sans-serif">many rows</text>
        <text x="340" y="226" textAnchor="middle" fill="#111" fontSize="10" fontWeight="500" fontFamily="system-ui, sans-serif">moderate</text>
        <text x="568" y="226" textAnchor="middle" fill="#111" fontSize="10" fontWeight="500" fontFamily="system-ui, sans-serif">few rows</text>

        <defs>
          <marker id="blueArrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" fill="#2563EB" />
          </marker>
        </defs>
      </svg>
      <figcaption className="text-center text-sm text-muted mt-3">
        PostgreSQL chooses the scan strategy based on how selective the query is.
      </figcaption>
    </figure>
  );
}

function ChecklistSvg() {
  const steps = [
    { n: "1", label: "Check Execution Time", sub: "Is it actually slow?" },
    { n: "2", label: "Find most expensive node", sub: "Where is actual time highest?" },
    { n: "3", label: "Compare est. vs actual rows", sub: "Mismatch? Run ANALYZE" },
    { n: "4", label: "Seq Scan + Rows Removed?", sub: "Candidate for an index" },
    { n: "5", label: "Sort: external merge?", sub: "Increase work_mem" },
    { n: "6", label: "Hash Batches > 1?", sub: "Increase work_mem" },
    { n: "7", label: "Multiply time \u00d7 loops", sub: "High loops hide cost" },
    { n: "8", label: "Check shared read", sub: "High reads = cache pressure" },
  ];

  return (
    <figure className="my-8">
      <svg
        viewBox="0 0 540 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[500px] mx-auto"
        role="img"
        aria-label="8-step diagnostic checklist for reading EXPLAIN ANALYZE output"
      >
        {steps.map((step, i) => {
          const y = 12 + i * 52;
          return (
            <g key={step.n}>
              {/* Connector line */}
              {i < steps.length - 1 && (
                <line x1="30" y1={y + 36} x2="30" y2={y + 52} stroke="#D1D5DB" strokeWidth="1.5" strokeDasharray="4 3" />
              )}
              {/* Number circle */}
              <circle cx="30" cy={y + 18} r="14" fill="#2563EB" />
              <text x="30" y={y + 23} textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="system-ui, sans-serif">{step.n}</text>
              {/* Card */}
              <rect x="56" y={y} width="474" height="38" rx="6" fill="#F9FAFB" stroke="#E5E5E5" strokeWidth="1" />
              <text x="72" y={y + 17} fill="#111" fontSize="13" fontWeight="600" fontFamily="system-ui, sans-serif">{step.label}</text>
              <text x="72" y={y + 31} fill="#6B7280" fontSize="11" fontFamily="system-ui, sans-serif">{step.sub}</text>
            </g>
          );
        })}
      </svg>
      <figcaption className="text-center text-sm text-muted mt-3">
        Work through this sequence top to bottom when reading any EXPLAIN ANALYZE output.
      </figcaption>
    </figure>
  );
}

/* ── Node anatomy illustration ── */

function NodeAnatomySvg() {
  return (
    <figure className="my-8">
      <svg
        viewBox="0 0 620 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[580px] mx-auto"
        role="img"
        aria-label="Anatomy of an EXPLAIN output node showing estimated and actual fields"
      >
        {/* Background card */}
        <rect x="10" y="10" width="600" height="180" rx="10" fill="#F9FAFB" stroke="#E5E5E5" strokeWidth="1.2" />

        {/* Estimated line */}
        <rect x="30" y="30" width="560" height="36" rx="6" fill="white" stroke="#D1D5DB" strokeWidth="1" />
        <text x="46" y="53" fill="#111" fontSize="11.5" fontWeight="500" fontFamily="ui-monospace, monospace">
          Seq Scan on orders
        </text>
        <text x="204" y="53" fill="#6B7280" fontSize="11.5" fontFamily="ui-monospace, monospace">
          (cost=
        </text>
        <text x="252" y="53" fill="#2563EB" fontSize="11.5" fontWeight="600" fontFamily="ui-monospace, monospace">
          0.00
        </text>
        <text x="277" y="53" fill="#6B7280" fontSize="11.5" fontFamily="ui-monospace, monospace">
          ..
        </text>
        <text x="289" y="53" fill="#2563EB" fontSize="11.5" fontWeight="600" fontFamily="ui-monospace, monospace">
          28.50
        </text>
        <text x="328" y="53" fill="#6B7280" fontSize="11.5" fontFamily="ui-monospace, monospace">
          {" rows="}
        </text>
        <text x="372" y="53" fill="#2563EB" fontSize="11.5" fontWeight="600" fontFamily="ui-monospace, monospace">
          1850
        </text>
        <text x="404" y="53" fill="#6B7280" fontSize="11.5" fontFamily="ui-monospace, monospace">
          {" width="}
        </text>
        <text x="456" y="53" fill="#2563EB" fontSize="11.5" fontWeight="600" fontFamily="ui-monospace, monospace">
          16
        </text>
        <text x="468" y="53" fill="#6B7280" fontSize="11.5" fontFamily="ui-monospace, monospace">)</text>

        {/* Estimated label */}
        <rect x="500" y="36" width="76" height="22" rx="4" fill="#2563EB" fillOpacity="0.1" />
        <text x="538" y="51" textAnchor="middle" fill="#2563EB" fontSize="10" fontWeight="600" fontFamily="system-ui, sans-serif">estimated</text>

        {/* Actual line */}
        <rect x="30" y="80" width="560" height="36" rx="6" fill="white" stroke="#D1D5DB" strokeWidth="1" />
        <text x="46" y="103" fill="#6B7280" fontSize="11.5" fontFamily="ui-monospace, monospace">
          {"(actual time="}
        </text>
        <text x="150" y="103" fill="#059669" fontSize="11.5" fontWeight="600" fontFamily="ui-monospace, monospace">
          0.026
        </text>
        <text x="185" y="103" fill="#6B7280" fontSize="11.5" fontFamily="ui-monospace, monospace">
          ..
        </text>
        <text x="197" y="103" fill="#059669" fontSize="11.5" fontWeight="600" fontFamily="ui-monospace, monospace">
          1.790
        </text>
        <text x="238" y="103" fill="#6B7280" fontSize="11.5" fontFamily="ui-monospace, monospace">
          {" rows="}
        </text>
        <text x="282" y="103" fill="#059669" fontSize="11.5" fontWeight="600" fontFamily="ui-monospace, monospace">
          1850
        </text>
        <text x="314" y="103" fill="#6B7280" fontSize="11.5" fontFamily="ui-monospace, monospace">
          {" loops="}
        </text>
        <text x="366" y="103" fill="#059669" fontSize="11.5" fontWeight="600" fontFamily="ui-monospace, monospace">
          1
        </text>
        <text x="374" y="103" fill="#6B7280" fontSize="11.5" fontFamily="ui-monospace, monospace">)</text>

        {/* Actual label */}
        <rect x="500" y="86" width="76" height="22" rx="4" fill="#059669" fillOpacity="0.1" />
        <text x="538" y="101" textAnchor="middle" fill="#059669" fontSize="10" fontWeight="600" fontFamily="system-ui, sans-serif">actual</text>

        {/* Legend keys */}
        <text x="46" y="148" fill="#2563EB" fontSize="11" fontWeight="600" fontFamily="system-ui, sans-serif">startup cost</text>
        <text x="148" y="148" fill="#2563EB" fontSize="11" fontWeight="600" fontFamily="system-ui, sans-serif">total cost</text>
        <text x="236" y="148" fill="#2563EB" fontSize="11" fontWeight="600" fontFamily="system-ui, sans-serif">est. rows</text>
        <text x="324" y="148" fill="#2563EB" fontSize="11" fontWeight="600" fontFamily="system-ui, sans-serif">avg width</text>

        <text x="46" y="172" fill="#059669" fontSize="11" fontWeight="600" fontFamily="system-ui, sans-serif">startup ms</text>
        <text x="148" y="172" fill="#059669" fontSize="11" fontWeight="600" fontFamily="system-ui, sans-serif">total ms</text>
        <text x="236" y="172" fill="#059669" fontSize="11" fontWeight="600" fontFamily="system-ui, sans-serif">actual rows</text>
        <text x="324" y="172" fill="#059669" fontSize="11" fontWeight="600" fontFamily="system-ui, sans-serif">loop count</text>
      </svg>
      <figcaption className="text-center text-sm text-muted mt-3">
        Each node shows the planner&apos;s estimates and (with ANALYZE) the actual runtime numbers.
      </figcaption>
    </figure>
  );
}

/* ── Join types illustration ── */

function JoinTypesSvg() {
  return (
    <figure className="my-8">
      <svg
        viewBox="0 0 680 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[640px] mx-auto"
        role="img"
        aria-label="Three join strategies: Nested Loop iterates, Hash Join builds hash table, Merge Join scans sorted inputs in parallel"
      >
        {/* ── Nested Loop ── */}
        <text x="108" y="18" textAnchor="middle" fill="#111" fontSize="13" fontWeight="600" fontFamily="system-ui, sans-serif">Nested Loop</text>
        {/* Outer rows */}
        {[0,1,2].map((i) => (
          <rect key={`nlo-${i}`} x="32" y={36 + i * 28} width="40" height="22" rx="3" fill="#2563EB" fillOpacity="0.15" stroke="#2563EB" strokeWidth="1" />
        ))}
        <text x="52" y="50" textAnchor="middle" fill="#2563EB" fontSize="9" fontWeight="600" fontFamily="system-ui, sans-serif">row</text>
        {/* Inner rows */}
        {[0,1,2,3].map((i) => (
          <rect key={`nli-${i}`} x={108 + i * 22} y="36" width="18" height="78" rx="3" fill="#F0F0F0" stroke="#D1D5DB" strokeWidth="0.8" />
        ))}
        {/* Arrows showing iteration */}
        <path d="M76,47 L108,47" stroke="#2563EB" strokeWidth="1" markerEnd="url(#blueArr2)" />
        <path d="M76,75 L108,75" stroke="#2563EB" strokeWidth="1" markerEnd="url(#blueArr2)" />
        <path d="M76,103 L108,103" stroke="#2563EB" strokeWidth="1" markerEnd="url(#blueArr2)" />
        <text x="108" y="132" fill="#6B7280" fontSize="10" fontFamily="system-ui, sans-serif">for each outer row,</text>
        <text x="108" y="146" fill="#6B7280" fontSize="10" fontFamily="system-ui, sans-serif">scan inner table</text>

        {/* ── Hash Join ── */}
        <text x="340" y="18" textAnchor="middle" fill="#111" fontSize="13" fontWeight="600" fontFamily="system-ui, sans-serif">Hash Join</text>
        {/* Hash table */}
        <rect x="288" y="36" width="60" height="78" rx="6" fill="#2563EB" fillOpacity="0.08" stroke="#2563EB" strokeWidth="1" strokeDasharray="4 2" />
        <text x="318" y="50" textAnchor="middle" fill="#2563EB" fontSize="8" fontWeight="600" fontFamily="system-ui, sans-serif">hash</text>
        <text x="318" y="62" textAnchor="middle" fill="#2563EB" fontSize="8" fontWeight="600" fontFamily="system-ui, sans-serif">table</text>
        {[0,1,2].map((i) => (
          <rect key={`ht-${i}`} x="296" y={70 + i * 14} width="44" height="10" rx="2" fill="#2563EB" fillOpacity="0.2" />
        ))}
        {/* Probe rows */}
        {[0,1,2].map((i) => (
          <g key={`hp-${i}`}>
            <rect x="370" y={50 + i * 24} width="40" height="18" rx="3" fill="#F0F0F0" stroke="#D1D5DB" strokeWidth="1" />
            <path d={`M370,${59 + i * 24} L352,${76 + Math.min(i, 2) * 14}`} stroke="#2563EB" strokeWidth="1" strokeDasharray="3 2" />
          </g>
        ))}
        <text x="340" y="132" fill="#6B7280" fontSize="10" fontFamily="system-ui, sans-serif" textAnchor="middle">build hash, then</text>
        <text x="340" y="146" fill="#6B7280" fontSize="10" fontFamily="system-ui, sans-serif" textAnchor="middle">probe with each row</text>

        {/* ── Merge Join ── */}
        <text x="564" y="18" textAnchor="middle" fill="#111" fontSize="13" fontWeight="600" fontFamily="system-ui, sans-serif">Merge Join</text>
        {/* Two sorted columns */}
        {[0,1,2,3].map((i) => (
          <g key={`mj-${i}`}>
            <rect x="510" y={36 + i * 22} width="32" height="18" rx="3" fill={i < 4 ? "#2563EB" : "#F0F0F0"} fillOpacity={i < 4 ? 0.12 + i * 0.06 : 1} stroke={i < 4 ? "#2563EB" : "#D1D5DB"} strokeWidth="1" />
            <rect x="586" y={36 + i * 22} width="32" height="18" rx="3" fill={i < 4 ? "#2563EB" : "#F0F0F0"} fillOpacity={i < 4 ? 0.12 + i * 0.06 : 1} stroke={i < 4 ? "#2563EB" : "#D1D5DB"} strokeWidth="1" />
            {/* Match lines */}
            <line x1="542" y1={45 + i * 22} x2="586" y2={45 + i * 22} stroke="#2563EB" strokeWidth="1" strokeDasharray="3 2" />
          </g>
        ))}
        <text x="526" y="134" textAnchor="middle" fill="#9CA3AF" fontSize="8" fontFamily="system-ui, sans-serif">sorted</text>
        <text x="602" y="134" textAnchor="middle" fill="#9CA3AF" fontSize="8" fontFamily="system-ui, sans-serif">sorted</text>
        <text x="564" y="152" fill="#6B7280" fontSize="10" fontFamily="system-ui, sans-serif" textAnchor="middle">both inputs sorted,</text>
        <text x="564" y="166" fill="#6B7280" fontSize="10" fontFamily="system-ui, sans-serif" textAnchor="middle">scan in parallel</text>

        <defs>
          <marker id="blueArr2" markerWidth="5" markerHeight="5" refX="3" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5" fill="#2563EB" />
          </marker>
        </defs>
      </svg>
      <figcaption className="text-center text-sm text-muted mt-3">
        PostgreSQL picks the join strategy based on table sizes, available indexes, and work_mem.
      </figcaption>
    </figure>
  );
}

/* ── Page Component ── */

export default function ExplainAnalyzePostgres() {
  return (
    <article className="relative">
      <TableOfContents items={toc} />
      <header className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">
          EXPLAIN / EXPLAIN ANALYZE — The Complete Guide to PostgreSQL Query Plans
        </h1>
        <p className="text-sm text-muted">By Ghazi</p>
      </header>

      <div className="space-y-8 text-base leading-relaxed text-foreground">

        {/* ── What Is a Query Plan? ── */}
        <section>
          <h2 id="what-is-a-query-plan" className="text-2xl font-semibold tracking-tight mb-4">
            What is a query plan?
          </h2>
          <p>
            PostgreSQL devises a query plan for each query it receives. Choosing
            the right plan to match the query structure and the properties of the
            data is absolutely critical for good performance, so the system
            includes a complex planner that tries to choose good plans. The{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">EXPLAIN</code>{" "}
            command lets you see exactly what that planner decided — before or
            after execution.
          </p>
        </section>

        {/* ── EXPLAIN vs. EXPLAIN ANALYZE ── */}
        <section>
          <h2 id="explain-vs-analyze" className="text-2xl font-semibold tracking-tight mb-4">
            EXPLAIN vs. EXPLAIN ANALYZE
          </h2>
          <p>
            These two commands are closely related but do fundamentally different
            things.
          </p>
          <p className="mt-4">
            <strong>
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">EXPLAIN</code>
            </strong>{" "}
            shows the planner&apos;s <em>estimated</em> execution strategy
            without running the query. PostgreSQL constantly tracks query
            statistics, so though{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">EXPLAIN</code>{" "}
            gives us an estimate, it is a good baseline for finding performance
            issues.
          </p>
          <p className="mt-4">
            <strong>
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">EXPLAIN ANALYZE</code>
            </strong>{" "}
            actually executes the query and shows real runtime statistics
            alongside the estimates. With this keyword,{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">EXPLAIN</code>{" "}
            does not only show the plan and PostgreSQL&apos;s estimates — it also
            executes the query (so be careful with{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">UPDATE</code>{" "}
            and{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">DELETE</code>!)
            and shows the actual execution time and row count for each step.
            This is indispensable for analyzing SQL performance.
          </p>

          <div className="rounded-xl border border-amber-300 bg-amber-50 p-5 mt-6">
            <p className="font-semibold text-amber-900 mb-2">Side effects warning</p>
            <p className="text-amber-800 text-sm leading-relaxed">
              Because{" "}
              <code className="rounded bg-amber-100 px-1.5 py-0.5 text-sm">EXPLAIN ANALYZE</code>{" "}
              truly runs the statement, writes to the database will happen. If
              you wish to use it on an{" "}
              <code className="rounded bg-amber-100 px-1.5 py-0.5 text-sm">INSERT</code>,{" "}
              <code className="rounded bg-amber-100 px-1.5 py-0.5 text-sm">UPDATE</code>,{" "}
              <code className="rounded bg-amber-100 px-1.5 py-0.5 text-sm">DELETE</code>,{" "}
              <code className="rounded bg-amber-100 px-1.5 py-0.5 text-sm">MERGE</code>,{" "}
              <code className="rounded bg-amber-100 px-1.5 py-0.5 text-sm">CREATE TABLE AS</code>,
              or{" "}
              <code className="rounded bg-amber-100 px-1.5 py-0.5 text-sm">EXECUTE</code>{" "}
              statement without letting the command affect your data, wrap it in
              a transaction and roll it back.
            </p>
          </div>

          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>{`BEGIN;
EXPLAIN ANALYZE UPDATE orders SET status = 'shipped' WHERE id = 42;
ROLLBACK;`}</code>
          </pre>
        </section>

        {/* ── Full Syntax ── */}
        <section>
          <h2 id="full-syntax" className="text-2xl font-semibold tracking-tight mb-4">
            Full syntax
          </h2>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto">
            <code>{`EXPLAIN [ (
  ANALYZE    [ boolean ],
  VERBOSE    [ boolean ],
  COSTS      [ boolean ],
  BUFFERS    [ boolean ],
  SETTINGS   [ boolean ],
  TIMING     [ boolean ],
  SUMMARY    [ boolean ],
  FORMAT     { TEXT | XML | JSON | YAML }
) ] statement;`}</code>
          </pre>

          <h3 className="text-xl font-semibold tracking-tight mt-8 mb-3">
            Option reference
          </h3>
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-surface text-left">
                  <th className="px-4 py-3 font-semibold border-b border-border">Option</th>
                  <th className="px-4 py-3 font-semibold border-b border-border">Default</th>
                  <th className="px-4 py-3 font-semibold border-b border-border">Requires ANALYZE</th>
                  <th className="px-4 py-3 font-semibold border-b border-border">What it shows</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["ANALYZE", "off", "\u2014", "Actual execution time and row counts per node"],
                  ["VERBOSE", "off", "No", "Output column lists, schema-qualified names"],
                  ["COSTS", "on", "No", "Estimated startup and total cost, rows, width"],
                  ["BUFFERS", "off", "Yes", "Shared/local/temp block reads, writes, and hits"],
                  ["SETTINGS", "off", "No", "Non-default planner configuration parameters"],
                  ["TIMING", "on", "Yes", "Per-node actual timing (disable to reduce overhead)"],
                  ["SUMMARY", "on", "Yes", "Planning and execution time footer"],
                  ["FORMAT", "TEXT", "No", "Output format (TEXT is most human-readable)"],
                ].map(([opt, def, req, desc]) => (
                  <tr key={opt} className="border-b border-border">
                    <td className="px-4 py-3 font-medium">
                      <code className="rounded bg-surface px-1.5 py-0.5 text-sm">{opt}</code>
                    </td>
                    <td className="px-4 py-3">{def}</td>
                    <td className="px-4 py-3">{req}</td>
                    <td className="px-4 py-3">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6">
            <strong>The recommended incantation for real performance work:</strong>
          </p>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>EXPLAIN (ANALYZE, BUFFERS) SELECT ...;</code>
          </pre>
          <p className="mt-4">
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">EXPLAIN (ANALYZE, BUFFERS)</code>{" "}
            (with{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">track_io_timing</code>{" "}
            turned on) will show you everything you need to know to diagnose SQL
            statement performance problems.
          </p>
        </section>

        {/* ── Reading the Output ── */}
        <section>
          <h2 id="reading-the-output" className="text-2xl font-semibold tracking-tight mb-4">
            Reading the output
          </h2>

          <h3 className="text-xl font-semibold tracking-tight mt-6 mb-3">
            Structure: it&apos;s a tree
          </h3>
          <p>
            A query plan is a tree of <em>nodes</em>. Each node represents one
            step the database takes to produce rows. Indentation shows
            parent&ndash;child relationships. Execution flows from the{" "}
            <strong>innermost/deepest</strong> nodes upward to the root.
          </p>

          <QueryPlanTreeSvg />

          <h3 className="text-xl font-semibold tracking-tight mt-8 mb-3">
            Anatomy of a node
          </h3>

          <NodeAnatomySvg />

          <p className="mt-4">
            <strong>Estimated fields{" "}
            (<code className="rounded bg-surface px-1.5 py-0.5 text-sm">cost=...</code>):</strong>
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">0.00</code>{" "}
              — startup cost: the planner&apos;s estimate of cost before this
              node returns its first row
            </li>
            <li>
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">28.50</code>{" "}
              — total cost: the planner&apos;s estimate of cost to return all rows
            </li>
            <li>
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">rows=1850</code>{" "}
              — estimated number of rows this node will output
            </li>
            <li>
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">width=16</code>{" "}
              — estimated average byte width of each output row
            </li>
          </ul>

          <p className="mt-6">
            <strong>Actual fields{" "}
            (<code className="rounded bg-surface px-1.5 py-0.5 text-sm">actual time=...</code>):</strong>
          </p>
          <p className="mt-2">
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">EXPLAIN ANALYZE</code>{" "}
            gives you a second parenthesis with the actual execution time in
            milliseconds, the actual row count, and a loop count that shows how
            often that node was executed.
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">0.026</code>{" "}
              — actual startup time in ms
            </li>
            <li>
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">1.790</code>{" "}
              — actual total time in ms
            </li>
            <li>
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">rows=1850</code>{" "}
              — actual rows returned
            </li>
            <li>
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">loops=1</code>{" "}
              — how many times this node was executed
            </li>
          </ul>

          <div className="rounded-xl border border-border bg-surface/50 p-5 mt-6">
            <p className="text-sm leading-relaxed">
              <strong>Important:</strong> When{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">loops &gt; 1</code>,
              the time shown is the <em>average</em> per loop. Multiply{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">actual time</code>{" "}
              by{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">loops</code>{" "}
              to get the true total time spent in that node.
            </p>
          </div>

          <h3 className="text-xl font-semibold tracking-tight mt-8 mb-3">
            Cost units
          </h3>
          <p>
            The unit for the estimated query cost is artificial — 1 is the cost
            for reading an 8 kB page during a sequential scan. Costs only mean
            something relative to each other; they are not milliseconds. The
            planner compares plan costs to pick the winner.
          </p>

          <h3 className="text-xl font-semibold tracking-tight mt-8 mb-3">
            The footer
          </h3>
          <p>
            At the bottom of an{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">EXPLAIN ANALYZE</code>{" "}
            output, you&apos;ll see:
          </p>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>{`Planning Time: 0.5 ms
Execution Time: 12.3 ms`}</code>
          </pre>
          <p className="mt-4">
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">Execution Time</code>{" "}
            is the total wall-clock time the query took. This is the number that
            matters most for end users.
          </p>
        </section>

        {/* ── Scan Node Types ── */}
        <section>
          <h2 id="scan-node-types" className="text-2xl font-semibold tracking-tight mb-4">
            Scan node types
          </h2>
          <p>
            The{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">EXPLAIN</code>{" "}
            statement shows how tables involved in a statement will be scanned
            — by index scan or sequential scan — and if multiple tables are
            used, what kind of join algorithm will be used.
          </p>

          <ScanTypesSvg />

          <h3 className="text-xl font-semibold tracking-tight mt-8 mb-3">
            Sequential Scan (<code className="rounded bg-surface px-1.5 py-0.5 text-sm">Seq Scan</code>)
          </h3>
          <p>
            The{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">Seq Scan</code>{" "}
            operation scans the entire relation (table) as stored on disk. Every
            row is read, and a filter is applied if there&apos;s a{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">WHERE</code>{" "}
            clause. This is expected and efficient for small tables or when a
            large proportion of rows are needed. It becomes a problem when it
            appears on a large table where only a few rows match.
          </p>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>{`Seq Scan on users  (cost=0.00..14.00 rows=2 width=222)
  Filter: (email = 'alice@example.com')`}</code>
          </pre>

          <h3 className="text-xl font-semibold tracking-tight mt-8 mb-3">
            Index Scan
          </h3>
          <p>
            The{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">Index Scan</code>{" "}
            performs a B-tree traversal, walks through the leaf nodes to find
            all matching entries, and fetches the corresponding table data. Good
            for selective queries that return a small number of rows.
          </p>

          <h3 className="text-xl font-semibold tracking-tight mt-8 mb-3">
            Index Only Scan
          </h3>
          <p>
            An{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">Index Only Scan</code>{" "}
            node occurs when the index completely covers the predicate and any
            returned columns — meaning no heap (table) access is needed at
            all. This is the most efficient scan type when applicable.
          </p>

          <h3 className="text-xl font-semibold tracking-tight mt-8 mb-3">
            Bitmap Index Scan / Bitmap Heap Scan
          </h3>
          <p>
            These two always appear together. A bitmap scan fetches all the
            tuple-pointers from the index in one go, sorts them using an
            in-memory bitmap data structure, and then visits the table tuples in
            physical tuple-location order. This is the middle ground — more
            selective than a full Seq Scan but less precise per-lookup than an
            Index Scan. It excels when multiple index conditions are combined
            with{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">AND</code>/<code className="rounded bg-surface px-1.5 py-0.5 text-sm">OR</code>.
          </p>
          <p className="mt-4">
            The{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">Recheck Cond</code>{" "}
            line you sometimes see below{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">Bitmap Heap Scan</code>{" "}
            appears when the bitmap becomes too large and PostgreSQL converts it
            to a lossy, page-level bitmap — it must re-check each row to
            confirm it actually matches.
          </p>
        </section>

        {/* ── Join Node Types ── */}
        <section>
          <h2 id="join-node-types" className="text-2xl font-semibold tracking-tight mb-4">
            Join node types
          </h2>
          <p>
            Generally, join operations process only two tables at a time. When a
            query has more joins, they are executed sequentially — first two
            tables, then the intermediate result with the next table.
          </p>

          <JoinTypesSvg />

          <h3 className="text-xl font-semibold tracking-tight mt-8 mb-3">
            Nested Loop
          </h3>
          <p>
            For each row from the outer table, PostgreSQL scans the inner table
            looking for matches. Nested Loop is useful for smaller datasets or
            indexed tables. However, it can be slow with large datasets unless
            properly optimized. When the inner side has an index on the join
            column, this strategy is very efficient.
          </p>

          <h3 className="text-xl font-semibold tracking-tight mt-8 mb-3">
            Hash Join
          </h3>
          <p>
            The hash join loads the candidate records from one side of the join
            into a hash table, which is then probed for each record from the
            other side of the join. Hash joins can only be used for equality
            conditions (<code className="rounded bg-surface px-1.5 py-0.5 text-sm">=</code>).
            They require enough{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">work_mem</code>{" "}
            to hold the hash table; if the table overflows memory, PostgreSQL
            spills to disk in multiple &ldquo;batches,&rdquo; which you&apos;ll
            see as{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">Batches: N</code>{" "}
            in the output.
          </p>

          <h3 className="text-xl font-semibold tracking-tight mt-8 mb-3">
            Merge Join
          </h3>
          <p>
            A merge join puts both input relations in sorted order (via a sort
            or index scan), and matches up on equal values by scanning through
            the two in parallel. It is the only way to handle really big
            datasets, though merge joins are slower than hash joins when sorting
            is required. Like hash joins, merge joins only support equality
            conditions.
          </p>
        </section>

        {/* ── Patterns to Recognize ── */}
        <section>
          <h2 id="patterns-to-recognize" className="text-2xl font-semibold tracking-tight mb-4">
            Key EXPLAIN ANALYZE patterns to recognize
          </h2>

          <h3 className="text-xl font-semibold tracking-tight mt-6 mb-3">
            Row count misestimates
          </h3>
          <p>
            Find the lowest node where the estimated row count is significantly
            different from the actual row count. Very often, this is the cause
            of bad performance — the long execution time somewhere else is only
            a consequence of a bad plan choice based on a bad estimate.
            &ldquo;Significantly different&rdquo; typically means a factor of 10
            or so.
          </p>
          <p className="mt-4">
            When the planner severely underestimates rows, it may choose a
            Nested Loop where a Hash Join would be faster. When it overestimates,
            it may choose a Seq Scan where an Index Scan would win. Fix this by
            running{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">ANALYZE</code>{" "}
            on the affected table, or by increasing{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">default_statistics_target</code>{" "}
            on columns with skewed data distributions.
          </p>

          <h3 className="text-xl font-semibold tracking-tight mt-8 mb-3">
            Slow sequential scans with filters
          </h3>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>{`Seq Scan on orders  (cost=0.00..2346.00 rows=35360 width=50)
  Filter: (status = 'pending')
  Rows Removed by Filter: 980000`}</code>
          </pre>
          <p className="mt-4">
            &ldquo;Rows Removed by Filter&rdquo; is a red flag. If a filter
            eliminates most of the scanned rows, that table is a strong
            candidate for an index.
          </p>

          <h3 className="text-xl font-semibold tracking-tight mt-8 mb-3">
            High <code className="rounded bg-surface px-1.5 py-0.5 text-sm">loops</code> in a Nested Loop
          </h3>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>Index Scan on order_items  (actual time=0.003..0.003 rows=2 loops=4500)</code>
          </pre>
          <p className="mt-4">
            Multiply:{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">0.003 ms &times; 4500 = 13.5 ms</code>{" "}
            total. A nested loop with a large loop count is often the source of
            unexpectedly slow queries, even if the per-loop time looks small.
          </p>

          <h3 className="text-xl font-semibold tracking-tight mt-8 mb-3">
            Sort spilling to disk
          </h3>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>Sort Method: external merge  Disk: 14MB</code>
          </pre>
          <p className="mt-4">
            When you see{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">external merge</code>{" "}
            instead of{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">quicksort</code>{" "}
            or{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">top-N heapsort</code>,
            the sort ran out of{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">work_mem</code>{" "}
            and spilled to disk. Increase{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">work_mem</code>{" "}
            for the session to fix this.
          </p>

          <h3 className="text-xl font-semibold tracking-tight mt-8 mb-3">
            Hash Batches &gt; 1
          </h3>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>{`Hash  (actual time=45.2..45.2 rows=500000 loops=1)
  Buckets: 16384  Batches: 8  Memory Usage: 4096kB`}</code>
          </pre>
          <p className="mt-4">
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">Batches: 8</code>{" "}
            means the hash table was too large for{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">work_mem</code>{" "}
            and was processed in 8 passes. Increasing{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">work_mem</code>{" "}
            may bring it to{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">Batches: 1</code>{" "}
            and yield a significant speedup.
          </p>
        </section>

        {/* ── The BUFFERS Option ── */}
        <section>
          <h2 id="the-buffers-option" className="text-2xl font-semibold tracking-tight mb-4">
            The BUFFERS option
          </h2>
          <p>
            Adding{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">BUFFERS</code>{" "}
            shows block-level I/O per node:
          </p>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>{`Seq Scan on orders  (actual time=0.026..1.790 rows=1850 loops=1)
  Buffers: shared hit=345 read=92`}</code>
          </pre>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>
              <strong><code className="rounded bg-surface px-1.5 py-0.5 text-sm">shared hit</code></strong>{" "}
              — blocks found in PostgreSQL&apos;s shared buffer cache (fast, no disk I/O)
            </li>
            <li>
              <strong><code className="rounded bg-surface px-1.5 py-0.5 text-sm">shared read</code></strong>{" "}
              — blocks read from disk or OS page cache (slower)
            </li>
            <li>
              <strong><code className="rounded bg-surface px-1.5 py-0.5 text-sm">shared written</code></strong>{" "}
              — blocks written during the query
            </li>
            <li>
              <strong><code className="rounded bg-surface px-1.5 py-0.5 text-sm">temp read/written</code></strong>{" "}
              — temporary files used for sorts or hash batches
            </li>
          </ul>
          <p className="mt-4">
            A high{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">read</code>{" "}
            count relative to{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">hit</code>{" "}
            suggests the working set doesn&apos;t fit in{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">shared_buffers</code>,
            or the data was cold. Shared blocks contain data from regular tables
            and indexes; local blocks contain data from temporary tables and
            indexes; while temporary blocks contain short-term working data used
            in sorts, hashes, Materialize plan nodes, and similar cases.
          </p>
        </section>

        {/* ── Output Formats ── */}
        <section>
          <h2 id="output-formats" className="text-2xl font-semibold tracking-tight mb-4">
            EXPLAIN output formats
          </h2>
          <p>
            For tooling and automation, use{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">FORMAT JSON</code>:
          </p>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) SELECT ...;</code>
          </pre>
          <p className="mt-4">
            This produces a machine-readable tree that many GUI tools and
            visualizers can consume directly. The default{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">TEXT</code>{" "}
            format is the most human-readable for manual inspection.
          </p>
        </section>

        {/* ── Companion Tools ── */}
        <section>
          <h2 id="companion-tools" className="text-2xl font-semibold tracking-tight mb-4">
            Useful companion tools
          </h2>
          <p>
            Reading long plans as raw text is tedious. Several tools can help:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>
              <strong>
                <a
                  href="https://explain.depesz.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-hover transition-colors"
                >
                  explain.depesz.com
                </a>
              </strong>{" "}
              — paste your plan text to get a color-coded, annotated view that
              highlights the most expensive nodes
            </li>
            <li>
              <strong>
                <a
                  href="https://explain.dalibo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-hover transition-colors"
                >
                  explain.dalibo.com
                </a>
              </strong>{" "}
              — similar visualizer with a graphical tree view
            </li>
            <li>
              <strong>
                <code className="rounded bg-surface px-1.5 py-0.5 text-sm">pg_stat_statements</code>
              </strong>{" "}
              — a built-in extension that tracks cumulative execution statistics
              across all queries, making it easy to find the queries that consume
              the most total time (not just the ones you thought to profile)
            </li>
          </ul>
        </section>

        {/* ── Practical Checklist ── */}
        <section>
          <h2 id="practical-checklist" className="text-2xl font-semibold tracking-tight mb-4">
            Practical checklist
          </h2>
          <p>
            When you open an{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">EXPLAIN (ANALYZE, BUFFERS)</code>{" "}
            output, work through this in order:
          </p>

          <ChecklistSvg />
        </section>

        {/* ── Repeatability ── */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-4">
            A note on repeatability
          </h2>
          <p>
            There is always a certain variation in query execution time, as data
            may not be in cache during the first execution. That&apos;s why it
            is valuable to repeat{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">EXPLAIN ANALYZE</code>{" "}
            a couple of times and see if the result changes. The first run may
            be slow due to cold I/O; subsequent runs reflect the warm-cache
            steady state.
          </p>
        </section>
      </div>
    </article>
  );
}
