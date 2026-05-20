import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export default function LoginRegister({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [prefilledEmail, setPrefilledEmail] = useState("");

  const handleLoginToggle = (email = "") => {
    if (email) {
      setPrefilledEmail(email);
    }
    setIsLogin(true);
  };

  const handleRegisterToggle = () => {
    setIsLogin(false);
  };

  if (isLogin) {
    return (
      <Login 
        onAuthSuccess={onAuthSuccess} 
        onRegisterToggle={handleRegisterToggle} 
        initialEmail={prefilledEmail} 
      />
    );
  }

  return (
    <Register 
      onLoginToggle={handleLoginToggle} 
    />
  );
}
