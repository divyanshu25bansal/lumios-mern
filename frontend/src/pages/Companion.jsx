import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Bot, Send, Sparkles, User as UserIcon } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { UserContext } from "../context/UserContext";
import { BASE_URL } from "../utils/constant";

const SUGGESTIONS = [
  "How am I doing today?",
  "I drank 500ml of water",
  "I slept 7 hours, quality 4",
  "I had 2 boiled eggs and toast for breakfast",
  "Mark my Morning walk habit as done",
  "How was my week?",
];

export default function Companion() {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState(() => [
    {
      role: "model",
      text: `Hi${user?.firstName ? ` ${user.firstName}` : ""}, I'm Aurora. Ask me how you're doing, or tell me what you ate, drank, or slept and I'll log it for you.`,
    },
  ]);
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isSending]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setIsSending(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/assistant/chat`,
        { message: trimmed, history: chatHistory },
        { withCredentials: true },
      );

      setChatHistory(response.data.history || []);
      setMessages((prev) => [
        ...prev,
        { role: "model", text: response.data.reply, toolCalls: response.data.toolCalls },
      ]);
    } catch (err) {
      console.error("Assistant error:", err.message);
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "Something went wrong reaching Aurora. Please try again.", isError: true },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <Sidebar>
      <main className="flex-1 bg-base-200 text-base-content p-4 lg:p-6 min-h-screen transition-colors duration-200">
        <div className="mx-auto max-w-4xl h-[calc(100vh-2rem)] lg:h-[calc(100vh-3rem)] flex flex-col space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Bot size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-base-content flex items-center gap-1.5">
                Aurora <Sparkles size={14} className="text-primary" />
              </h1>
              <p className="text-xs opacity-60">Your AI health companion</p>
            </div>
          </div>

          {/* Chat window */}
          <div className="flex-1 rounded-2xl border border-base-300 bg-base-100 shadow-xs flex flex-col overflow-hidden">
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                      msg.role === "user"
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary/10 text-secondary"
                    }`}
                  >
                    {msg.role === "user" ? <UserIcon size={15} /> : <Bot size={15} />}
                  </div>

                  <div
                    className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-primary text-primary-content"
                        : msg.isError
                          ? "bg-error/10 text-error border border-error/20"
                          : "bg-base-200 text-base-content"
                    }`}
                  >
                    {msg.text}
                    {msg.toolCalls?.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {msg.toolCalls.map((call, callIdx) => (
                          <span
                            key={callIdx}
                            className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-base-100 text-base-content/60 border border-base-300"
                          >
                            {call.name.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="flex items-start gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                    <Bot size={15} />
                  </div>
                  <div className="rounded-2xl px-3.5 py-2.5 bg-base-200">
                    <span className="loading loading-dots loading-sm"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions, shown until the user starts chatting */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => sendMessage(suggestion)}
                    className="text-[11px] font-semibold px-3 py-1.5 rounded-xl border border-base-300 bg-base-100 hover:bg-base-200 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t border-base-300 p-3 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Aurora anything about your health data..."
                disabled={isSending}
                className="input input-bordered flex-1 rounded-xl bg-base-200 focus:outline-primary text-sm"
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className="btn btn-primary btn-square rounded-xl shrink-0"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </main>
    </Sidebar>
  );
}
