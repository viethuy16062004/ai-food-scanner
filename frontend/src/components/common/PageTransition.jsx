import React from "react";

export default function PageTransition({ children }) {
  return <div className="animate-page-enter">{children}</div>;
}
