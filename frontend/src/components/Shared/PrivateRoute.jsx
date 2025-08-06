import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ correct

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" />;

  try {
    const decoded = jwt_decode(token);
    const isExpired = decoded.exp * 1000 < Date.now(); // JWT expiry is in seconds

    if (isExpired) {
      localStorage.removeItem("token");
      return <Navigate to="/" />;
    }

    return children;
  } catch (error) {
    localStorage.removeItem("token");
    return <Navigate to="/" />;
  }
};

export default PrivateRoute;
