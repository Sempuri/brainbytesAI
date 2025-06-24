import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navigation from "../components/Navigation";
import api from "../utils/api";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState({
    name: "",
    email: "",
    preferredSubjects: [],
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [token, setToken] = useState(null);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const subjectOptions = [
    "math",
    "science",
    "history",
    "literature",
    "geography",
    "language",
  ];

  // Get token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login"); // redirect if no token
      return;
    }
    setToken(storedToken);

    const fetchProfile = async () => {
      try {
        const response = await api.get("/api/auth/profile", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setUser(response.data);
      } catch {
        // Silenced error to avoid lint warning
        setMessage({
          text: "Failed to load profile data. Please login again.",
          type: "error",
        });
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (subject) => {
    setUser((prev) => {
      const preferredSubjects = prev.preferredSubjects.includes(subject)
        ? prev.preferredSubjects.filter((s) => s !== subject)
        : [...prev.preferredSubjects, subject];
      return { ...prev, preferredSubjects };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    try {
      const response = await api.put("/api/auth/profile", user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      setMessage({ text: "Profile updated successfully!", type: "success" });
    } catch (error) {
      // Optionally handle error, or remove console if not needed
      // console.error("Error updating profile:", error);
      setMessage({
        text: "Failed to update profile. Please try again.",
        type: "error",
      });
    }
  };

  const handleSignOut = () => {
    setShowSignOutConfirm(true);
  };

  const confirmSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const cancelSignOut = () => {
    setShowSignOutConfirm(false);
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Nunito, sans-serif",
      }}
    >
      <Navigation user={user.name ? user : null} />

      <h1 style={{ color: "#333", marginBottom: "20px" }}>User Profile</h1>

      {message.text && (
        <div
          style={{
            padding: "10px",
            margin: "10px 0",
            backgroundColor: message.type === "error" ? "#ffebee" : "#e8f5e9",
            color: message.type === "error" ? "#c62828" : "#2e7d32",
            borderRadius: "4px",
          }}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Loading user data...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Name:
            </label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "16px",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              disabled
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "16px",
                backgroundColor: "#f0f0f0",
              }}
            />
            <small style={{ color: "#777" }}>Email cannot be changed.</small>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "10px",
                fontWeight: "bold",
              }}
            >
              Preferred Subjects:
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {subjectOptions.map((subject) => (
                <div
                  key={subject}
                  onClick={() => handleSubjectChange(subject)}
                  style={{
                    padding: "10px 15px",
                    backgroundColor: user.preferredSubjects.includes(subject)
                      ? "#2196f3"
                      : "#e3f2fd",
                    color: user.preferredSubjects.includes(subject)
                      ? "white"
                      : "#333",
                    borderRadius: "20px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {subject.charAt(0).toUpperCase() + subject.slice(1)}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <button
              type="submit"
              style={{
                padding: "12px 24px",
                backgroundColor: "#2196f3",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
            >
              Update Profile
            </button>

            <span
              onClick={handleSignOut}
              style={{
                color: "#1976d2",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Sign Out
            </span>
          </div>
        </form>
      )}
      {showSignOutConfirm && (
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
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "32px 24px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
              minWidth: 320,
              textAlign: "center",
              fontFamily: "Nunito, sans-serif",
            }}
          >
            <h2 style={{ color: "#333", marginTop: 1, marginBottom: 16 }}>
              Sign Out
            </h2>
            <p style={{ color: "#555", marginBottom: 24 }}>
              Are you sure you want to sign out?
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
              <button
                onClick={confirmSignOut}
                style={{
                  padding: "10px 24px",
                  background: "#2196f3",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Yes, Sign Out
              </button>
              <button
                onClick={cancelSignOut}
                style={{
                  padding: "10px 24px",
                  background: "#e3f2fd",
                  color: "#1976d2",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
