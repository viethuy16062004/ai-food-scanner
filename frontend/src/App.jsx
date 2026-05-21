import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { api } from "./services/api";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import UserApp from "./components/user/UserApp";
import AdminApp from "./components/admin/AdminApp";

export default function App() {
  // Initialize auth state synchronously from localStorage to prevent
  // flash-redirect on page reload (e.g. /result → /login → /home)
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!api.getToken());
  const [user, setUser] = useState(() => api.getUser());
  const [prefilledEmail, setPrefilledEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    const currentUser = api.getUser();
    setUser(currentUser);
    // Navigate to the appropriate home page based on role
    if (currentUser?.role === "ROLE_ADMIN") {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate("/home", { replace: true });
    }
  };

  const handleLogout = () => {
    api.logout();
    setIsAuthenticated(false);
    setUser(null);
    navigate("/login", { replace: true });
  };

  // If not authenticated, only show auth routes
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route
          path="/login"
          element={
            <Login
              onAuthSuccess={handleAuthSuccess}
              onRegisterToggle={() => navigate("/register")}
              initialEmail={prefilledEmail}
            />
          }
        />
        <Route
          path="/register"
          element={
            <Register
              onLoginToggle={(email = "") => {
                if (email) setPrefilledEmail(email);
                navigate("/login");
              }}
            />
          }
        />
        {/* Redirect any unknown path to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Authenticated: route by role
  if (user?.role === "ROLE_ADMIN") {
    return (
      <Routes>
        <Route path="/admin/*" element={<AdminApp user={user} onLogout={handleLogout} />} />
        {/* Redirect to admin dashboard if on root or unknown path */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/*" element={<UserApp user={user} onLogout={handleLogout} />} />
    </Routes>
  );
}
