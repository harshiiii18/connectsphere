
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/signup", { name, email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        backgroundImage:
          "radial-gradient(circle 500px at 50% 0%, rgba(108, 92, 231, 0.35), transparent)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "80px",
        paddingBottom: "60px",
        fontFamily: "sans-serif",
      }}
    >
      {/* Card */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#111116",
          border: "1px solid #2a2a35",
          borderRadius: "16px",
          padding: "40px",
          width: "380px",
          boxShadow: "0 0 60px rgba(99, 91, 255, 0.15)",
        }}
      >
        {/* Icon */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "12px",
              background: "#1c1c24",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
            }}
          >
            💬
          </div>
        </div>

        {/* Brand name */}
        <p
          style={{
            color: "#8b7cf6",
            textAlign: "center",
            fontSize: "24px",
            fontWeight: "600",
            letterSpacing: "1.5px",
            margin: "0 0 4px",
          }}
        >
          ConnectSphere
        </p>

        <h2 style={{ color: "#fff", textAlign: "center", margin: "0 0 6px", fontSize:"18px"}}>
          Ready to Chat?
        </h2>
        <p
          style={{
            color: "#9a9aa5",
            textAlign: "center",
            margin: "0 0 28px",
            fontSize: "14px",
          }}
        >
          Sign up and start connecting today.
        </p>

        {error && (
          <p style={{ color: "#ff6b6b", fontSize: "13px", marginBottom: "12px" }}>
            {error}
          </p>
        )}

        <label style={{ color: "#fff", fontSize: "13px", fontWeight: "600" }}>
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
          style={inputStyle}
        />

        <label style={{ color: "#fff", fontSize: "13px", fontWeight: "600" }}>
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          style={inputStyle}
        />

        <label style={{ color: "#fff", fontSize: "13px", fontWeight: "600" }}>
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          style={{ ...inputStyle, marginBottom: "24px" }}
        />

        <button
          type="submit"
          onClick={() => navigate("/login")}
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: "10px",
            border: "none",
            background: "#6c5ce7",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "15px",
            cursor: "pointer",
          }}
        >
          Continue
        </button>

        <p
          style={{
            textAlign: "center",
            color: "#9a9aa5",
            fontSize: "13px",
            marginTop: "20px",
          }}
        >
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ color: "#8b7cf6", cursor: "pointer", fontWeight: "600" }}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "10px",
  border: "1px solid #2a2a35",
  background: "#1a1a22",
  color: "#fff",
  outline: "none",
  marginTop: "6px",
  marginBottom: "16px",
  boxSizing: "border-box",
  fontSize: "14px",
};

export default Signup;