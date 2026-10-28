export type BarDatum = {
  label: string;
  value: number;
  note?: string;
};

export default function BarChart({
  data,
  unit = "条",
  total,
  caption,
}: {
  data: BarDatum[];
  unit?: string;
  total?: number;
  caption?: string;
}) {
  const max = Math.max(...data.map((item) => item.value), 1);
  return (
    <figure className="not-prose my-8">
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex items-baseline justify-between gap-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {item.label}
              </span>
              <span className="shrink-0 text-sm tabular-nums text-slate-500 dark:text-slate-400">
                {item.value}
                {unit}
                {total ? ` · ${Math.round((item.value / total) * 100)}%` : ""}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-sky-500 dark:bg-sky-400"
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </div>
            {item.note && (
              <div className="mt-1 text-xs leading-relaxed text-slate-400 dark:text-slate-500">
                {item.note}
              </div>
            )}
          </div>
        ))}
      </div>
      {caption && (
        <figcaption className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
