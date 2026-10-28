import type { ReactNode } from "react";

export type CalloutTone = "note" | "insight" | "warning";

const tones: Record<
  CalloutTone,
  { wrapper: string; label: string; title: string }
> = {
  note: {
    wrapper:
      "border-sky-200 bg-sky-50/80 dark:border-sky-800 dark:bg-sky-950/40",
    label: "text-sky-600 dark:text-sky-400",
    title: "text-sky-900 dark:text-sky-100",
  },
  insight: {
    wrapper:
      "border-emerald-200 bg-emerald-50/80 dark:border-emerald-800 dark:bg-emerald-950/40",
    label: "text-emerald-600 dark:text-emerald-400",
    title: "text-emerald-900 dark:text-emerald-100",
  },
  warning: {
    wrapper:
      "border-amber-200 bg-amber-50/80 dark:border-amber-800 dark:bg-amber-950/40",
    label: "text-amber-600 dark:text-amber-400",
    title: "text-amber-900 dark:text-amber-100",
  },
};

const labels: Record<CalloutTone, string> = {
  note: "说明",
  insight: "结论",
  warning: "边界",
};

export default function Callout({
  tone = "note",
  title,
  children,
}: {
  tone?: CalloutTone;
  title?: string;
  children: ReactNode;
}) {
  const style = tones[tone];
  return (
    <aside
      className={`not-prose my-6 rounded-xl border px-5 py-4 ${style.wrapper}`}
    >
      <div
        className={`mb-1 text-xs font-bold uppercase tracking-widest ${style.label}`}
      >
        {labels[tone]}
      </div>
      {title && (
        <div className={`mb-2 text-base font-bold ${style.title}`}>{title}</div>
      )}
      <div className="text-sm leading-7 text-slate-700 dark:text-slate-300">
        {children}
      </div>
    </aside>
  );
}
