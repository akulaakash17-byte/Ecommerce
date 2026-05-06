export default function EmptyState({ title = "Nothing found", message, action }) {
  return (
    <div className="card flex min-h-56 flex-col items-center justify-center px-6 py-12 text-center">
      <h3 className="text-lg font-black text-slate-950">{title}</h3>
      {message ? <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">{message}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
