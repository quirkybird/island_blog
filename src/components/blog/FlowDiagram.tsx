export type FlowTone = "sky" | "emerald" | "amber" | "violet" | "slate";

export type FlowNode = {
  title: string;
  detail?: string;
  tag?: string;
  tone?: FlowTone;
};

const toneClasses: Record<FlowTone, { badge: string; tag: string }> = {
  sky: {
    badge: "bg-sky-600 text-white dark:bg-sky-400 dark:text-slate-950",
    tag: "border-sky-200 text-sky-700 dark:border-sky-800 dark:text-sky-300",
  },
  emerald: {
    badge:
      "bg-emerald-600 text-white dark:bg-emerald-400 dark:text-slate-950",
    tag: "border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-300",
  },
  amber: {
    badge: "bg-amber-500 text-white dark:bg-amber-400 dark:text-slate-950",
    tag: "border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-300",
  },
  violet: {
    badge: "bg-violet-600 text-white dark:bg-violet-400 dark:text-slate-950",
    tag: "border-violet-200 text-violet-700 dark:border-violet-800 dark:text-violet-300",
  },
  slate: {
    badge: "bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-950",
    tag: "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300",
  },
};

export default function FlowDiagram({
  nodes,
  caption,
}: {
  nodes: FlowNode[];
  caption?: string;
}) {
  return (
    <figure className="not-prose my-8">
      <ol
        className="m-0 list-none space-y-0 p-0"
        style={{ listStyle: "none", margin: 0, padding: 0 }}
      >
        {nodes.map((node, index) => {
          const tone = toneClasses[node.tone ?? "sky"];
          return (
            <li
              key={`${node.title}-${index}`}
              style={{ listStyle: "none", margin: 0, padding: 0 }}
            >
              <div className="rounded-xl border border-slate-200 bg-white/60 p-4 dark:border-slate-700 dark:bg-slate-900/40">
                <div className="flex items-start gap-3">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold tabular-nums ${tone.badge}`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex min-h-7 flex-wrap items-center gap-2">
                      <div className="text-sm font-semibold leading-7 text-slate-800 dark:text-slate-100">
                        {node.title}
                      </div>
                      {node.tag && (
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium leading-4 ${tone.tag}`}
                        >
                          {node.tag}
                        </span>
                      )}
                    </div>
                    {node.detail && (
                      <div className="mt-1.5 text-xs leading-6 text-slate-500 dark:text-slate-400">
                        {node.detail}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {index < nodes.length - 1 && (
                <div className="flex justify-center py-1.5" aria-hidden="true">
                  <svg
                    width="18"
                    height="26"
                    viewBox="0 0 18 26"
                    fill="none"
                    className="text-slate-300 dark:text-slate-600"
                  >
                    <path
                      d="M9 2v19"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M4 16l5 5 5-5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {caption && (
        <figcaption className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
