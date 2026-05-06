import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CHATBOT_PROMPTS, getChatbotReply } from "../../data/faqs";
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

  const addConversation = (question) => {
    const trimmed = question.trim();
    if (!trimmed) return;

    const reply = getChatbotReply(trimmed);
    setMessages((current) => [
      ...current,
      { role: "user", text: trimmed },
      { role: "assistant", text: reply.answer, actionLabel: reply.actionLabel, actionTo: reply.actionTo },
    ]);
    setInput("");
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
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {CHATBOT_PROMPTS.map((prompt) => (
                <button
                  className="shrink-0 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-brand-600 hover:text-brand-700"
                  key={prompt}
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
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask a question..."
                ref={inputRef}
                value={input}
              />
              <button className="btn-primary px-3 py-2" type="submit">Send</button>
            </form>
          </div>
        </div>
      ) : null}

      <button
        aria-label="Open FAQ chatbot"
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-white shadow-soft transition hover:-translate-y-1 hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-slate-300"
        onClick={toggleOpen}
        type="button"
      >
        <ChatIcon className="h-7 w-7" />
      </button>
    </div>
  );
}
