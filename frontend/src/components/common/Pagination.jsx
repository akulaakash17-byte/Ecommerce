export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-between gap-4">
      <button
        className="btn-secondary"
        disabled={meta.page <= 1}
        onClick={() => onPageChange(meta.page - 1)}
        type="button"
      >
        Previous
      </button>
      <span className="text-sm font-bold text-slate-600">
        Page {meta.page} of {meta.totalPages}
      </span>
      <button
        className="btn-secondary"
        disabled={meta.page >= meta.totalPages}
        onClick={() => onPageChange(meta.page + 1)}
        type="button"
      >
        Next
      </button>
    </div>
  );
}
