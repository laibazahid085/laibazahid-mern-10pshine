import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../../services/authService";
import "./Auth.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signupUser(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    }
  };

  return (
    <div className="auth-container royal-theme">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Signup</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="input-field"
          required
        />

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

        <button type="submit" className="primary-btn">
          Signup
        </button>
        <p className="footer-text">
          Already have an account? <a onClick={() => navigate("/")}>Login</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
