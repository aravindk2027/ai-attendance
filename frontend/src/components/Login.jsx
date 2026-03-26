import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import "../styles/style.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const { login } = useContext(DataContext);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    const result = await login(email, password, role);
    
    if (result.success) {
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper animate-slide-up">
        <div className="glass-card login-card">
          
          <div className="login-logo">
            <span className="login-logo-icon">🤖</span>
            <span>AI Attendance</span>
          </div>
          
          <p className="login-subtitle">Sign in to your dashboard</p>

          <form onSubmit={handleLogin}>
            <div className="role-selector">
              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={role === "student"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <div className="role-label">
                  <span style={{ fontSize: "20px" }}>👨‍🎓</span>
                  <span>Student</span>
                </div>
              </label>

              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === "admin"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <div className="role-label">
                  <span style={{ fontSize: "20px" }}>🛡️</span>
                  <span>Admin</span>
                </div>
              </label>
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div style={{ color: "var(--danger)", marginBottom: "16px", fontSize: "14px", textAlign: "left", background: "var(--danger-bg)", padding: "10px", borderRadius: "8px" }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary login-btn-full">
              <span>Continue to Dashboard ➔</span>
            </button>
          </form>

          <p className="login-footer">
            Don't have an account? <a href="#">Request Access</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;