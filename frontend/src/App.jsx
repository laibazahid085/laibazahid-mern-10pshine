import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/Shared/PrivateRoute";
import NoteEditor from "./components/Notes/NoteEditor";
import Profile from "./components/Profile/UserProfile";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/note/new"
          element={
            <PrivateRoute>
              <NoteEditor />
            </PrivateRoute>
          }
        />
        <Route
          path="/note/:id"
          element={
            <PrivateRoute>
              <NoteEditor />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
