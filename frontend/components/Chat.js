import React, { useEffect, useState } from "react";
import api from "../utils/api";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/api/chat?session=abc123")
      .then((res) => setMessages(res.data))
      .catch((err) => setError("Error loading chat"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {messages.map((msg, index) => (
        <div key={index}>{msg.message}</div>
      ))}
    </div>
  );
};

export default Chat;