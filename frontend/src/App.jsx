import React, { useState, useEffect } from "react";
import { api } from "./services/api";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import UserApp from "./components/user/UserApp";
import AdminApp from "./components/admin/AdminApp";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [prefilledEmail, setPrefilledEmail] = useState("");

  // Check auth status on mount
  useEffect(() => {
    const token = api.getToken();
    if (token) {
      setIsAuthenticated(true);
      setUser(api.getUser());
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setUser(api.getUser());
  };

  const handleLogout = () => {
    api.logout();
    setIsAuthenticated(false);
    setUser(null);
    setShowLogin(true);
  };

  // Not authenticated: show Login or Register
  if (!isAuthenticated) {
    if (showLogin) {
      return (
        <Login
          onAuthSuccess={handleAuthSuccess}
          onRegisterToggle={() => setShowLogin(false)}
          initialEmail={prefilledEmail}
        />
      );
    }
    return (
      <Register
        onLoginToggle={(email = "") => {
          if (email) setPrefilledEmail(email);
          setShowLogin(true);
        }}
      />
    );
  }

  // Authenticated: route by role
  if (user?.role === "ROLE_ADMIN") {
    return <AdminApp user={user} onLogout={handleLogout} />;
  }

  return <UserApp user={user} onLogout={handleLogout} />;
}
