export type DataTableProps = {
  columns: string[];
  rows: (string | number)[][];
  caption?: string;
  numericColumns?: number[];
  /** 默认让第一列保持单行，避免短标签被拆成单字。 */
  nowrapColumns?: number[];
};

export default function DataTable({
  columns,
  rows,
  caption,
  numericColumns = [],
  nowrapColumns = [0],
}: DataTableProps) {
  return (
    <figure className="not-prose my-8">
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/70">
              {columns.map((column, index) => (
                <th
                  key={column}
                  scope="col"
                  className={`whitespace-nowrap px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 ${
                    numericColumns.includes(index) ? "text-right" : ""
                  }`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-t border-slate-100 dark:border-slate-800"
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`px-4 py-3 align-top text-slate-600 dark:text-slate-300 ${
                      numericColumns.includes(cellIndex)
                        ? "text-right tabular-nums"
                        : ""
                    } ${
                      nowrapColumns.includes(cellIndex)
                        ? "whitespace-nowrap"
                        : ""
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
