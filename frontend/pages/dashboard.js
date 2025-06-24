import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Navigation from "../components/Navigation";
import api from "../utils/api";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    byCategory: {},
    byQuestionType: {},
    sentiment: { positive: 0, neutral: 0, negative: 0 },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // redirect if no token
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch user profile using token
        const userResponse = await api.get("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data);

        // Fetch messages
        const messagesResponse = await api.get("/api/messages", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(messagesResponse.data);

        // Fetch learning materials
        const materialsResponse = await api.get("/api/materials");
        setMaterials(materialsResponse.data);

        // Process user message stats (from the messages array)
        analyzeMessages(messagesResponse.data);
      } catch {
        // Silenced error to avoid lint warning
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Analyze messages for statistics
  const analyzeMessages = (msgs) => {
    // Filter only user questions and AI responses
    const userQuestions = msgs.filter((msg) => msg.isUser);
    const aiResponses = msgs.filter((msg) => !msg.isUser);

    // Initialize counters
    const totalQuestions = userQuestions.length;
    const byCategory = {};
    const byQuestionType = {};
    const sentiment = { positive: 0, neutral: 0, negative: 0 };

    // Process AI responses for accurate analytics
    aiResponses.forEach((response) => {
      // Count by category
      if (response.category) {
        byCategory[response.category] =
          (byCategory[response.category] || 0) + 1;
      }

      // Count by question type
      if (response.questionType) {
        byQuestionType[response.questionType] =
          (byQuestionType[response.questionType] || 0) + 1;
      }

      // Count by sentiment
      if (
        response.sentiment &&
        Object.prototype.hasOwnProperty.call(sentiment, response.sentiment)
      ) {
        sentiment[response.sentiment] += 1;
      }
    });

    // Set the stats state
    setStats({
      totalQuestions,
      byCategory,
      byQuestionType,
      sentiment,
    });
  };

  // Calculate top subjects excluding "general" category
  const calculateTopSubjects = (messages) => {
    const subjectCounts = {};

    messages
      .filter((msg) => !msg.isUser)
      .forEach((msg) => {
        if (msg.category && msg.category !== "general") {
          subjectCounts[msg.category] = (subjectCounts[msg.category] || 0) + 1;
        }
      });

    // If we have no categorized messages, don't show an empty chart
    if (Object.keys(subjectCounts).length === 0) {
      return { "Not enough data": 1 };
    }

    return subjectCounts;
  };

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Nunito, sans-serif",
      }}
    >
      <Navigation />

      <h1 style={{ color: "#333", marginBottom: "20px" }}>
        Learning Dashboard
      </h1>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <div>
          {/* User Welcome Section */}
          <div
            style={{
              backgroundColor: "#e3f2fd",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "20px",
            }}
          >
            <h2>Welcome, {user ? user.name : "Guest"}!</h2>
            {user?.preferredSubjects?.length > 0 ? (
              <p>
                Your preferred subjects:{" "}
                {user.preferredSubjects.length > 0
                  ? user.preferredSubjects
                      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                      .join(", ")
                  : "None selected"}
              </p>
            ) : (
              <p>
                Please{" "}
                <Link href="/profile" style={{ color: "#2196f3" }}>
                  create a profile
                </Link>{" "}
                to customize your learning experience.
              </p>
            )}
          </div>

          {/* Learning Stats Section */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            {/* Total Questions Card */}
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Questions Asked</h3>
              <p
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#2196f3",
                }}
              >
                {stats.totalQuestions}
              </p>
            </div>

            {/* Questions by Category */}
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Top Subject</h3>
              {Object.keys(calculateTopSubjects(messages)).length > 0 ? (
                <p
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#ff9800",
                  }}
                >
                  {Object.entries(calculateTopSubjects(messages))
                    .sort((a, b) => b[1] - a[1])[0][0]
                    .charAt(0)
                    .toUpperCase() +
                    Object.entries(calculateTopSubjects(messages))
                      .sort((a, b) => b[1] - a[1])[0][0]
                      .slice(1)}
                </p>
              ) : (
                <p>No data available</p>
              )}
            </div>

            {/* Sentiment Analysis */}
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Sentiment Analysis</h3>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#4caf50",
                    }}
                  >
                    {stats.sentiment.positive}
                  </div>
                  <div>Positive</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#9e9e9e",
                    }}
                  >
                    {stats.sentiment.neutral}
                  </div>
                  <div>Neutral</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#f44336",
                    }}
                  >
                    {stats.sentiment.negative}
                  </div>
                  <div>Negative</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <h2 style={{ color: "#333" }}>Recent Activity</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            {/* Recent Questions */}
            <div>
              <h3>Recent Questions</h3>
              <div
                style={{
                  backgroundColor: "#f9f9f9",
                  borderRadius: "12px",
                  height: "300px",
                  overflow: "auto",
                  padding: "10px",
                }}
              >
                {messages
                  .filter((msg) => msg.isUser)
                  .slice(-10)
                  .reverse()
                  .map((message) => (
                    <div
                      key={message._id}
                      style={{
                        padding: "10px",
                        margin: "5px 0",
                        backgroundColor: "#e3f2fd",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        router.push(
                          `/?question=${encodeURIComponent(message.text)}`,
                        )
                      } // <-- Add this line
                    >
                      <div>{message.text}</div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          marginTop: "5px",
                        }}
                      >
                        {new Date(message.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                {messages.filter((msg) => msg.isUser).length === 0 && (
                  <p style={{ textAlign: "center", color: "#666" }}>
                    No questions yet
                  </p>
                )}
              </div>
            </div>

            {/* Learning Materials */}
            <div>
              <h3>Available Learning Materials</h3>
              <div
                style={{
                  backgroundColor: "#f9f9f9",
                  borderRadius: "12px",
                  height: "300px",
                  overflow: "auto",
                  padding: "10px",
                }}
              >
                {materials.map((material) => (
                  <div
                    key={material._id}
                    style={{
                      padding: "10px",
                      margin: "5px 0",
                      backgroundColor: "#e8f5e9",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedMaterial(material)}
                  >
                    <div style={{ fontWeight: "bold" }}>{material.topic}</div>
                    <div style={{ fontSize: "14px", marginTop: "5px" }}>
                      Subject:{" "}
                      {material.subject.charAt(0).toUpperCase() +
                        material.subject.slice(1)}
                    </div>
                  </div>
                ))}
                {materials.length === 0 && (
                  <p style={{ textAlign: "center", color: "#666" }}>
                    No learning materials yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedMaterial && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setSelectedMaterial(null)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "32px 24px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
              minWidth: 320,
              maxWidth: 500,
              textAlign: "left",
              fontFamily: "Nunito, sans-serif",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMaterial(null)}
              style={{
                position: "absolute",
                top: 12,
                right: 16,
                background: "none",
                border: "none",
                fontSize: "22px",
                color: "#888",
                cursor: "pointer",
              }}
              aria-label="Close"
            >
              ×
            </button>
            <h2 style={{ color: "#2196f3", marginTop: 1 }}>
              {selectedMaterial.topic}
            </h2>
            <div style={{ color: "#555", marginBottom: 8 }}>
              Subject:{" "}
              {selectedMaterial.subject.charAt(0).toUpperCase() +
                selectedMaterial.subject.slice(1)}
            </div>
            <div
              style={{ marginTop: 16, color: "#222", whiteSpace: "pre-line" }}
            >
              {selectedMaterial.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
