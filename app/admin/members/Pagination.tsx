import React from "react";
interface Props {
  page: number;
  total: number;
  pageSize: number;
  onPage: (p: number) => void;
  onPageSize?: (size: number) => void;
}
export default function Pagination({ page, total, pageSize, onPage, onPageSize }: Props) {
  const pages = Math.ceil(total / pageSize);
  if (pages <= 1) return null;

  return (
    <div className="flex items-center gap-4 py-2">
      <button
        className="px-3 py-1 rounded bg-gray-200 hover:bg-blue-100 disabled:opacity-40"
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
      >Prev</button>
      <span className="font-semibold text-blue-800">
        Page {page} of {pages}
      </span>
      <button
        className="px-3 py-1 rounded bg-gray-200 hover:bg-blue-100 disabled:opacity-40"
        onClick={() => onPage(page + 1)}
        disabled={page === pages}
      >Next</button>
      {onPageSize && (
        <select
          className="ml-2 border rounded px-2 py-1"
          value={pageSize}
          onChange={e => onPageSize(Number(e.target.value))}
        >
          {[5, 10, 20, 50].map(sz => (
            <option key={sz} value={sz}>{sz} /page</option>
          ))}
        </select>
      )}
    </div>
  );
}
