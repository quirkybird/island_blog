export type StatItem = {
  value: string;
  label: string;
  note?: string;
};

export default function StatGrid({
  items,
  caption,
}: {
  items: StatItem[];
  caption?: string;
}) {
  return (
    <figure className="not-prose my-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/60"
          >
            <div className="text-2xl font-black tracking-tight text-sky-600 dark:text-sky-400">
              {item.value}
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
              {item.label}
            </div>
            {item.note && (
              <div className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {item.note}
              </div>
            )}
          </div>
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
