import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CHATBOT_PROMPTS } from "../../data/faqs";
import { chatbotService } from "../../services/chatbotService";
import ChatIcon from "./ChatIcon";

const welcomeMessage = {
  role: "assistant",
  text: "Hi. I can help with Siddipet property listings, site visits, office contact, listing your property, and common questions.",
};

export default function ChatbotWidget() {
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([welcomeMessage]);
  const [loading, setLoading] = useState(false);

  const addConversation = async (question) => {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    const userMessage = { role: "user", text: trimmed };
    const currentHistory = messages
      .filter((message) => ["user", "assistant"].includes(message.role))
      .slice(-8);

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await chatbotService.reply({
        message: trimmed,
        history: currentHistory,
      });
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: response.reply,
          actionLabel: response.actionLabel,
          actionTo: response.actionTo,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: error.message || "AI chatbot is not connected. Please check the Groq API key in backend settings.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const submit = (event) => {
    event.preventDefault();
    addConversation(input);
  };

  const toggleOpen = () => {
    setOpen((current) => !current);
    window.setTimeout(() => inputRef.current?.focus(), 120);
  };

  return (
    <div className="fixed bottom-5 left-5 z-50">
      {open ? (
        <div className="mb-3 w-[calc(100vw-2.5rem)] max-w-sm overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
          <div className="flex items-center justify-between bg-slate-950 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-600">
                <ChatIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-black">Siddipet Assistant</p>
                <p className="text-xs text-slate-300">FAQ and property help</p>
              </div>
            </div>
            <button
              aria-label="Close chatbot"
              className="rounded px-2 py-1 text-lg leading-none text-slate-300 hover:bg-white/10 hover:text-white"
              onClick={() => setOpen(false)}
              type="button"
            >
              x
            </button>
          </div>

          <div className="max-h-80 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div
                className={`max-w-[88%] rounded-lg px-3 py-2 text-sm leading-6 ${
                  message.role === "user"
                    ? "ml-auto bg-brand-700 text-white"
                    : "bg-white text-slate-700 shadow-sm"
                }`}
                key={`${message.role}-${index}`}
              >
                <p>{message.text}</p>
                {message.actionTo ? (
                  <Link
                    className="mt-2 inline-flex text-xs font-black text-brand-700 underline"
                    onClick={() => setOpen(false)}
                    to={message.actionTo}
                  >
                    {message.actionLabel}
                  </Link>
                ) : null}
              </div>
            ))}
            {loading ? (
              <div className="max-w-[88%] rounded-lg bg-white px-3 py-2 text-sm font-semibold leading-6 text-slate-500 shadow-sm">
                Thinking...
              </div>
            ) : null}
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {CHATBOT_PROMPTS.map((prompt) => (
                <button
                  className="shrink-0 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-brand-600 hover:text-brand-700"
                  key={prompt}
                  disabled={loading}
                  onClick={() => addConversation(prompt)}
                  type="button"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <form className="flex gap-2" onSubmit={submit}>
              <input
                className="field min-w-0 flex-1 py-2"
                disabled={loading}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask a question..."
                ref={inputRef}
                value={input}
              />
              <button className="btn-primary px-3 py-2" disabled={loading} type="submit">
                {loading ? "Wait" : "Send"}
              </button>
            </form>
          </div>
        </div>
      ) : null}

      <button
        aria-label="Open FAQ chatbot"
        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-700 text-white shadow-soft ring-4 ring-white transition hover:-translate-y-1 hover:bg-brand-600 focus:outline-none focus:ring-brand-100 sm:h-14 sm:w-14"
        onClick={toggleOpen}
        type="button"
      >
        <ChatIcon className="h-6 w-6 sm:h-7 sm:w-7" />
      </button>
    </div>
  );
}
