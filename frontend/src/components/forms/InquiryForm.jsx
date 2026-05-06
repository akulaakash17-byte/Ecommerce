import { useState } from "react";
import ErrorMessage from "../common/ErrorMessage";
import { inquiryService } from "../../services/inquiryService";

const initialState = { name: "", phone: "", message: "" };
const successMessage = "Inquiry sent. Our office will contact you soon.";

export default function InquiryForm({ propertyId }) {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: "", success: "" });

    try {
      await inquiryService.create({ ...form, property_id: propertyId });
      setForm(initialState);
      setStatus({ loading: false, error: "", success: successMessage });
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: "" });
    }
  };

  return (
    <>
      {status.success ? (
        <div
          aria-live="polite"
          className="fixed right-4 top-24 z-50 max-w-sm rounded-lg border border-brand-100 bg-white px-4 py-3 text-sm font-bold text-brand-700 shadow-soft"
          role="status"
        >
          <div className="flex items-start justify-between gap-3">
            <span>{status.success}</span>
            <button
              className="text-lg leading-none text-slate-400 hover:text-slate-700"
              onClick={() => setStatus((current) => ({ ...current, success: "" }))}
              type="button"
              aria-label="Dismiss notification"
            >
              x
            </button>
          </div>
        </div>
      ) : null}
      <form className="grid gap-4" onSubmit={submit}>
        <ErrorMessage message={status.error} />
        <div>
          <label className="label" htmlFor="name">Name</label>
          <input className="field" id="name" onChange={(event) => update("name", event.target.value)} required value={form.name} />
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone</label>
          <input className="field" id="phone" onChange={(event) => update("phone", event.target.value)} required value={form.phone} />
        </div>
        <div>
          <label className="label" htmlFor="message">Message</label>
          <textarea className="field min-h-28" id="message" onChange={(event) => update("message", event.target.value)} required value={form.message} />
        </div>
        <button className="btn-primary" disabled={status.loading} type="submit">
          {status.loading ? "Sending..." : "Send inquiry"}
        </button>
      </form>
    </>
  );
}
