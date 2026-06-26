import { useState, useEffect, useRef } from "react";
import Sidebar from "../page 4/sidebar";
import Message from "./msg";
import { api } from "../api";
import "./coach.css";
import { useRequireProfile } from "../useRequireProfile";

function Coach() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const [error, setError] = useState("");

  useRequireProfile(error);
  useEffect(() => {
    api.getCoachHistory()
      .then((data) => {
        if (data.messages.length === 0) {
          setMessages([{ sender: "ai", text: "Hello! How can I help you with your financial journey today?" }]);
        } else {
          setMessages(data.messages.map((m) => ({
            sender: m.role === "assistant" ? "ai" : "user",
            text: m.content,
          })));
        }
      })
      .catch(() => {
        setError(err.message);
        setMessages([{ sender: "ai", text: "Hello! How can I help you with your financial journey today?" }]);
      });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setLoading(true);

    try {
      const data = await api.sendCoachMessage(userMessage);
      setMessages((prev) => [...prev, { sender: "ai", text: data.message }]);
    } catch {
      setMessages((prev) => [...prev, { sender: "ai", text: "I'm having trouble connecting right now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="coach-page">
      <Sidebar activePage="coach" />

      <div className="coach-content">
        <div className="coach-header">
          <h1>AI Financial Coach</h1>
          <p>Ask questions about your financial future.</p>
        </div>

        <div className="chat-container">
          {messages.map((message, index) => (
            <Message key={index} sender={message.sender} text={message.text} />
          ))}
          {loading && <Message sender="ai" text="Thinking..." />}
          <div ref={bottomRef} />
        </div>

        <div className="input-row">
          <input
            type="text"
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
          />
          <button onClick={handleSend} disabled={loading}>
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Coach;