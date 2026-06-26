import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    setError("");
    if (!form.username || !form.password) {
      setError("Please enter your username and password.");
      return;
    }
    setLoading(true);
    try {
      const data = await api.login(form);
      login(data.user);
      navigate(data.hasProfile ? "/dashboard" : "/financial");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <h2>Welcome Back</h2>

      {error && (
        <p style={{ color: "red", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
          {error}
        </p>
      )}

      <input
        type="text"
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
      />

      <button className="login-btn" onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      <p>Don't have an account?</p>
      <button className="signup-link" onClick={() => navigate("/signup")}>
        Create Account
      </button>
    </div>
  );
}

export default Login;