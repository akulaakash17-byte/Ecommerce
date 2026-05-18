import WhatsAppIcon from "./WhatsAppIcon";
import { OFFICE_PHONE_HREF } from "../../data/propertyTypes";
import { createWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGE } from "../../utils/whatsapp";

function PhoneIcon({ className = "h-6 w-6" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M7.8 4.6 9.4 8c.3.7.2 1.5-.4 2l-1.1 1.1a11.5 11.5 0 0 0 5 5l1.1-1.1c.5-.5 1.3-.7 2-.4l3.4 1.6c.7.3 1.1 1 1 1.8l-.4 2.2c-.1.8-.8 1.3-1.6 1.3A15.9 15.9 0 0 1 2.5 5.6c0-.8.6-1.5 1.3-1.6L6 3.6c.8-.1 1.5.3 1.8 1Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function FloatingWhatsAppButton() {
  return (
    <div className="fixed bottom-24 right-4 z-40 grid gap-3 sm:bottom-5 sm:right-5">
      <a
        aria-label={`Call us at ${OFFICE_PHONE_HREF}`}
        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-white shadow-soft transition hover:-translate-y-1 hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-slate-300 sm:h-14 sm:w-14"
        href={`tel:${OFFICE_PHONE_HREF}`}
        title="Call office"
      >
        <PhoneIcon className="h-6 w-6 sm:h-7 sm:w-7" />
        <span className="sr-only">Call office</span>
      </a>
      <a
        aria-label="Chat with us on WhatsApp"
        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft transition hover:-translate-y-1 hover:bg-[#1ebe5d] focus:outline-none focus:ring-4 focus:ring-green-200 sm:h-14 sm:w-14"
        href={createWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGE)}
        rel="noreferrer"
        target="_blank"
        title="Chat on WhatsApp"
      >
        <WhatsAppIcon className="h-6 w-6 sm:h-7 sm:w-7" />
        <span className="sr-only">Chat on WhatsApp</span>
      </a>
    </div>
  );
}
