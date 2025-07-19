import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import Navigation from "../components/Navigation";
import ReactMarkdown from "react-markdown";
import api from "../utils/api";

export default function Home() {
  const router = useRouter();
  const messageRefs = useRef({});
  const [showNotification, setShowNotification] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [lastResponse, setLastResponse] = useState({
    category: "",
    questionType: "",
    sentiment: "",
  });
  const messageEndRef = useRef(null);

  const subjects = [
    "all",
    "math",
    "science",
    "history",
    "literature",
    "geography",
    "language",
  ];

  // Fetch user profile
  useEffect(() => {
    const syncUser = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
      }
      if (token) {
        api
          .get("/api/auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => setUser(res.data))
          .catch(() => setUser(null));
      } else {
        setUser(null);
      }
    };

    // Listen for storage changes (e.g., login in another tab)
    window.addEventListener("storage", syncUser);

    // Also call on mount
    syncUser();

    return () => {
      window.removeEventListener("storage", syncUser);
    };
  }, [router]);

  // Fetch messages from the API
  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/api/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(response.data);
      setLoading(false);
    } catch {
      // Silenced error to avoid lint warning
      setLoading(false);
    }
  };

  // Submit a new message
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setIsTyping(true); // Show typing indicator
      const userMsg = newMessage;
      setNewMessage("");

      // Optimistically add user message to UI
      const tempUserMsg = {
        _id: Date.now().toString(),
        text: userMsg,
        isUser: true,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempUserMsg]);

      // Send to backend and get AI response
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/api/messages",
        { text: userMsg },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Store response metadata
      setLastResponse({
        category: response.data.category || "",
        questionType: response.data.questionType || "",
        sentiment: response.data.sentiment || "",
      });

      // Reset notification visibility for new messages
      setShowNotification(true);

      // Replace the temporary message with the actual one and add AI response
      setMessages((prev) => {
        // Filter out the temporary message
        const filteredMessages = prev.filter(
          (msg) => msg._id !== tempUserMsg._id,
        );
        // Add the real messages from the API
        return [
          ...filteredMessages,
          response.data.userMessage,
          response.data.aiMessage,
        ];
      });

      // Refresh messages from the server to ensure synchronization
      setTimeout(() => {
        fetchMessages();
      }, 500);
    } catch {
      // Silenced error to avoid lint warning
      // Show error in chat
      setMessages((prev) => [
        ...prev,
        {
          _id: Date.now().toString(),
          text: "Sorry, I couldn't process your request. Please try again later.",
          isUser: false,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Filter messages by subject category
  const filteredMessages = messages.filter((message) => {
    if (selectedSubject === "all") return true;
    return message.category === selectedSubject;
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedSubject]);

  // Load messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    // Add markdown styles dynamically
    const style = document.createElement("style");
    style.innerHTML = `
      .markdown-content p {
        margin-top: 0.5em;
        margin-bottom: 0.5em;
      }
      .markdown-content strong {
        font-weight: bold;
      }
      .markdown-content em {
        font-style: italic;
      }
      .markdown-content ul {
        padding-left: 1.5em;
        margin-top: 0.5em;
        margin-bottom: 0.5em;
      }
      .markdown-content li {
        margin-bottom: 0.25em;
      }
      .markdown-content ul li::marker {
        color: #2196f3;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Scroll to the question if present in chat history (from dashboard)
  useEffect(() => {
    if (router.query.question && filteredMessages.length > 0) {
      // Find the first user message that matches the question text in the filtered list
      const found = filteredMessages.find(
        (msg) => msg.text === router.query.question && msg.isUser,
      );
      if (found && messageRefs.current[found._id]) {
        messageRefs.current[found._id].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [router.query.question, filteredMessages]);

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Nunito, sans-serif",
      }}
    >
      <Navigation user={user} />

      {user && (
        <div
          style={{
            backgroundColor: "#e3f2fd",
            padding: "10px 15px",
            borderRadius: "8px",
            marginBottom: "15px",
          }}
        >
          <p style={{ margin: "0" }}>
            Welcome back bruh, <strong>{user.name}</strong>!
          </p>
        </div>
      )}

      {/* Subject Filter */}
      <div style={{ marginBottom: "15px" }}>
        <div style={{ fontSize: "14px", marginBottom: "5px" }}>
          Filter by subject:
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {subjects.map((subject) => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              style={{
                padding: "6px 12px",
                backgroundColor:
                  selectedSubject === subject ? "#2196f3" : "#e3f2fd",
                color: selectedSubject === subject ? "white" : "#333",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              {subject === "all"
                ? "All Subjects"
                : subject.charAt(0).toUpperCase() + subject.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          height: "500px",
          overflowY: "auto",
          padding: "16px",
          marginBottom: "20px",
          backgroundColor: "#f9f9f9",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <p>Loading conversation history...</p>
          </div>
        ) : (
          <div>
            {filteredMessages.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <h3>Welcome to BrainBytes AI Tutor!</h3>
                <p>Ask me any question about anything.</p>
              </div>
            ) : (
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {filteredMessages.map((message) => (
                  <li
                    key={message._id}
                    ref={(el) => {
                      if (el) messageRefs.current[message._id] = el;
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: message.isUser ? "flex-end" : "flex-start",
                      padding: "12px 16px",
                      margin: "8px 0",
                      backgroundColor: message.isUser ? "#e3f2fd" : "#e8f5e9",
                      color: "#333",
                      borderRadius: "12px",
                      maxWidth: "80%",
                      wordBreak: "break-word",
                      marginLeft: message.isUser ? "auto" : "0",
                      marginRight: message.isUser ? "0" : "auto",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div
                      style={{
                        margin: "0 0 5px 0",
                        lineHeight: "1.5",
                        //whiteSpace: "pre-line",
                      }}
                    >
                      {message.isUser ? (
                        message.text
                      ) : (
                        <div className="markdown-content">
                          <ReactMarkdown>{message.text}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        textAlign: message.isUser ? "right" : "left",
                      }}
                    >
                      {message.isUser ? "You" : "AI Tutor"} •{" "}
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </div>
                  </li>
                ))}
                {isTyping && (
                  <li
                    style={{
                      padding: "12px 16px",
                      margin: "8px 0",
                      backgroundColor: "#e8f5e9",
                      color: "#333",
                      borderRadius: "12px",
                      maxWidth: "80%",
                      marginLeft: "0",
                      marginRight: "auto",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div style={{ margin: "0" }}>AI tutor is typing...</div>
                  </li>
                )}
                <div ref={messageEndRef} />
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Notification when latest message is in a different category */}
      {lastResponse.category &&
        selectedSubject !== "all" &&
        selectedSubject !== lastResponse.category &&
        showNotification && (
          <div
            style={{
              backgroundColor: "#fff3cd",
              border: "1px solid #ffeeba",
              color: "#856404",
              padding: "10px 15px",
              paddingRight: "40px", // padding to make room for the × button
              borderRadius: "8px",
              fontSize: "14px",
              marginBottom: "15px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "relative", // For absolute positioning of close button
            }}
          >
            <div style={{ flex: 1 }}>
              <p style={{ margin: "0" }}>
                <strong>New message in a different subject!</strong> Your latest
                AI response was categorized as{" "}
                <strong>{lastResponse.category}</strong> and won&apos;t appear
                in the current filter.
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowNotification(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#856404",
                fontSize: "20px",
                cursor: "pointer",
                padding: "0 8px",
                position: "absolute",
                top: "8px",
                right: "12px",
                fontWeight: "bold",
                lineHeight: "1", // Better centering
                width: "24px",
                height: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: "10", // Ensure it's above other elements
              }}
              aria-label="Close notification"
            >
              ×
            </button>

            <button
              onClick={() => {
                setSelectedSubject(
                  lastResponse.category === "general"
                    ? "all"
                    : lastResponse.category,
                );
                setShowNotification(false); // Also close notification when clicking View in
              }}
              style={{
                backgroundColor: "#2196f3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "6px 12px",
                marginLeft: "15px",
                cursor: "pointer",
              }}
            >
              View in {lastResponse.category}
            </button>
          </div>
        )}

      {/* Response Metadata Display */}
      {lastResponse.category && (
        <div
          style={{
            backgroundColor: "#f5f5f5",
            padding: "10px 15px",
            borderRadius: "8px",
            fontSize: "14px",
            marginBottom: "15px",
          }}
        >
          <p style={{ margin: "0" }}>
            Last response - Category: <strong>{lastResponse.category}</strong> |
            Type: <strong>{lastResponse.questionType}</strong> | Sentiment:{" "}
            <strong>{lastResponse.sentiment}</strong>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ask a question..."
          style={{
            flex: "1",
            padding: "14px 16px",
            borderRadius: "12px 0 0 12px",
            border: "1px solid #ddd",
            fontSize: "16px",
            outline: "none",
          }}
          disabled={isTyping}
        />
        <button
          type="submit"
          style={{
            padding: "14px 24px",
            backgroundColor: isTyping ? "#90caf9" : "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "0 12px 12px 0",
            fontSize: "16px",
            cursor: isTyping ? "not-allowed" : "pointer",
            transition: "background-color 0.3s",
          }}
          disabled={isTyping}
        >
          {isTyping ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
