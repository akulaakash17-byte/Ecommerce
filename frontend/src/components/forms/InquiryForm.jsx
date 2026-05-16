import { useState } from "react";
import ErrorMessage from "../common/ErrorMessage";
import { inquiryService } from "../../services/inquiryService";

const initialState = { name: "", phone: "", message: "" };
const successMessage = "Inquiry sent. Our office will contact you soon.";
const namePattern = /^[A-Za-z][A-Za-z .'-]{1,79}$/;
const phonePattern = /^(?:\+?91)?[6-9]\d{9}$/;
const messagePattern = /^(?=.*[A-Za-z0-9])[A-Za-z0-9\s.,'"/!?()&:+-]{5,500}$/;
const validationMessages = {
  name: "Enter a valid name using letters, spaces, apostrophes, periods, or hyphens.",
  phone: "Enter a valid 10-digit Indian mobile number, optionally starting with +91. Letters are not allowed.",
  message: "Enter 5 to 500 characters using letters, numbers, spaces, and common punctuation.",
};

function normalizePhoneInput(value) {
  const cleaned = value.replace(/[^\d+]/g, "");
  const withoutExtraPlus = cleaned.replace(/\+/g, "");

  return cleaned.startsWith("+") ? `+${withoutExtraPlus.slice(0, 12)}` : withoutExtraPlus.slice(0, 12);
}

export default function InquiryForm({ propertyId }) {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const updatePhone = (value) => update("phone", normalizePhoneInput(value));

  const submit = async (event) => {
    event.preventDefault();

    const trimmedForm = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      message: form.message.trim(),
    };

    if (!namePattern.test(trimmedForm.name)) {
      setStatus({ loading: false, error: validationMessages.name, success: "" });
      return;
    }

    if (!phonePattern.test(trimmedForm.phone)) {
      setStatus({ loading: false, error: validationMessages.phone, success: "" });
      return;
    }

    if (!messagePattern.test(trimmedForm.message)) {
      setStatus({ loading: false, error: validationMessages.message, success: "" });
      return;
    }

    setStatus({ loading: true, error: "", success: "" });

    try {
      await inquiryService.create({ ...trimmedForm, property_id: propertyId });
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
      <form className="grid gap-5" onSubmit={submit}>
        <ErrorMessage message={status.error} />
        <div>
          <label className="label" htmlFor="name">Name</label>
          <input
            autoComplete="name"
            className="field px-4 py-3.5 text-base"
            id="name"
            maxLength={80}
            onChange={(event) => update("name", event.target.value)}
            pattern={namePattern.source}
            required
            title={validationMessages.name}
            value={form.name}
          />
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone</label>
          <input
            autoComplete="tel"
            className="field px-4 py-3.5 text-base"
            id="phone"
            inputMode="tel"
            maxLength={13}
            onChange={(event) => updatePhone(event.target.value)}
            pattern={phonePattern.source}
            placeholder="8897422872"
            required
            title={validationMessages.phone}
            value={form.phone}
          />
        </div>
        <div>
          <label className="label" htmlFor="message">Message</label>
          <textarea
            className="field min-h-44 px-4 py-3.5 text-base leading-7"
            id="message"
            maxLength={500}
            onChange={(event) => update("message", event.target.value)}
            pattern={messagePattern.source}
            placeholder="Tell us the property type, location, budget, and preferred visit time."
            required
            title={validationMessages.message}
            value={form.message}
          />
        </div>
        <button className="btn-primary py-3.5 text-base" disabled={status.loading} type="submit">
          {status.loading ? "Sending..." : "Send inquiry"}
        </button>
      </form>
    </>
  );
}
