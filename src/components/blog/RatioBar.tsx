export type RatioTone = "sky" | "amber" | "emerald" | "violet" | "slate";

export type RatioSegment = {
  label: string;
  value: number;
  tone?: RatioTone;
};

const toneClasses: Record<
  RatioTone,
  { bar: string; swatch: string }
> = {
  sky: {
    bar: "bg-sky-500 dark:bg-sky-400",
    swatch: "bg-sky-500 dark:bg-sky-400",
  },
  amber: {
    bar: "bg-amber-400 dark:bg-amber-500",
    swatch: "bg-amber-400 dark:bg-amber-500",
  },
  emerald: {
    bar: "bg-emerald-500 dark:bg-emerald-400",
    swatch: "bg-emerald-500 dark:bg-emerald-400",
  },
  violet: {
    bar: "bg-violet-500 dark:bg-violet-400",
    swatch: "bg-violet-500 dark:bg-violet-400",
  },
  slate: {
    bar: "bg-slate-400 dark:bg-slate-500",
    swatch: "bg-slate-400 dark:bg-slate-500",
  },
};

export default function RatioBar({
  segments,
  caption,
}: {
  segments: RatioSegment[];
  caption?: string;
}) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1;
  return (
    <figure className="not-prose my-8">
      <div className="flex h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className={toneClasses[segment.tone ?? "sky"].bar}
            style={{ width: `${(segment.value / total) * 100}%` }}
            title={`${segment.label} ${segment.value}`}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        {segments.map((segment) => (
          <span
            key={segment.label}
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400"
          >
            <span
              className={`h-2.5 w-2.5 rounded-sm ${toneClasses[segment.tone ?? "sky"].swatch}`}
            />
            {segment.label}
            <span className="font-semibold tabular-nums text-slate-800 dark:text-slate-200">
              {segment.value} · {Math.round((segment.value / total) * 100)}%
            </span>
          </span>
        ))}
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
