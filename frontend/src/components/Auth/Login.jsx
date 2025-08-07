import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Auth.css"; // Make sure this CSS file exists

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🔐 Call login service (which stores token in localStorage)
      await loginUser(formData);

      // ✅ Optional: Handle session if user came from signup
      if (location.state?.fromSignup && location.state.userName) {
        sessionStorage.setItem("newlySignedUpUser", location.state.userName);
      }
      toast.success("Welcome, Back");
      navigate("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="auth-container royal-theme">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Login</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="input-field"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="input-field"
          required
        />

        <button type="submit" className="primary-btnn">
          Login
        </button>

        <p className="footer-text">
          Don't have an account?{" "}
          <span className="link" onClick={() => navigate("/signup")}>
            Signup
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
