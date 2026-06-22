import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { api } from "./services/api";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import UserApp from "./components/user/UserApp";
import AdminApp from "./components/admin/AdminApp";
import LandingPage from "./components/user/LandingPage";
import PageTransition from "./components/common/PageTransition";
import { Activity } from "lucide-react";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!api.getToken());
  const [user, setUser] = useState(() => api.getUser());
  const [prefilledEmail, setPrefilledEmail] = useState("");
  const [isInitializing, setIsInitializing] = useState(true);
  const [loadingState, setLoadingState] = useState("idle"); // idle, loading, finish

  const navigate = useNavigate();
  const location = useLocation();

  // Initial web loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1000); // 1s display premium splash
    return () => clearTimeout(timer);
  }, []);

  // Top Loading Bar triggers on route change
  useEffect(() => {
    if (isInitializing) return;
    setLoadingState("loading");
    const timer = setTimeout(() => {
      setLoadingState("finish");
    }, 350);
    const idleTimer = setTimeout(() => {
      setLoadingState("idle");
    }, 750);
    return () => {
      clearTimeout(timer);
      clearTimeout(idleTimer);
    };
  }, [location.pathname, isInitializing]);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    const currentUser = api.getUser();
    setUser(currentUser);
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

  // Splash Loader on first load
  if (isInitializing) {
    return (
      <div className="fixed inset-0 bg-[#f8fafc] z-[9999] flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/20 animate-pulse">
            <Activity className="w-8 h-8 text-white animate-spin-slow" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent tracking-tight">
            AI NutriScan
          </h2>
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mt-2"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Top Progress Loading Bar */}
      {loadingState !== "idle" && (
        <div className={`top-loading-bar ${loadingState === "loading" ? "start" : "finish"}`} />
      )}

      {/* Routes Routing */}
      {!isAuthenticated ? (
        (() => {
          const path = location.pathname;
          const isAuthRequiredPath = 
            path.startsWith("/admin") || 
            ["/home", "/scan", "/meal-planner", "/health-log", "/history", "/profile", "/notifications", "/result"].some(p => path.startsWith(p));

          return (
            <Routes>
              <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
              <Route
                path="/login"
                element={
                  <PageTransition>
                    <Login
                      onAuthSuccess={handleAuthSuccess}
                      onRegisterToggle={() => navigate("/register")}
                      initialEmail={prefilledEmail}
                    />
                  </PageTransition>
                }
              />
              <Route
                path="/register"
                element={
                  <PageTransition>
                    <Register
                      onLoginToggle={(email = "") => {
                        if (email) setPrefilledEmail(email);
                        navigate("/login");
                      }}
                    />
                  </PageTransition>
                }
              />
              {/* Redirect authenticated routes back to login, others to landing page */}
              <Route path="*" element={<Navigate to={isAuthRequiredPath ? "/login" : "/"} replace />} />
            </Routes>
          );
        })()
      ) : user?.role === "ROLE_ADMIN" ? (
        <Routes>
          <Route path="/admin/*" element={<PageTransition><AdminApp user={user} onLogout={handleLogout} /></PageTransition>} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/*" element={<UserApp user={user} onLogout={handleLogout} />} />
        </Routes>
      )}
    </>
  );
}
