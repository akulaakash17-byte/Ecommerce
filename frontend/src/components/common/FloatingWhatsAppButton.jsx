import WhatsAppIcon from "./WhatsAppIcon";
import { createWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGE } from "../../utils/whatsapp";

export default function FloatingWhatsAppButton() {
  return (
    <a
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft transition hover:-translate-y-1 hover:bg-[#1ebe5d] focus:outline-none focus:ring-4 focus:ring-green-200"
      href={createWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGE)}
      rel="noreferrer"
      target="_blank"
      title="Chat on WhatsApp"
    >
      <WhatsAppIcon className="h-7 w-7" />
      <span className="sr-only">Chat on WhatsApp</span>
    </a>
  );
}
