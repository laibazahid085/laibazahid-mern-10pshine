import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("❌ No token found");
    return <Navigate to="/" />;
  }

  try {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    console.log("✅ JWT decoded:", decoded);
    console.log("⏰ Token expired:", isExpired);

    if (isExpired) {
      localStorage.removeItem("token");
      return <Navigate to="/" />;
    }

    return children;
  } catch (error) {
    console.log("❌ Invalid token");
    localStorage.removeItem("token");
    return <Navigate to="/" />;
  }
};

export default PrivateRoute;
