import React from "react";

function LoginLayout({ children }) {
  return (
    <div className="bg-slate-200 min-h-screen w-screen flex justify-center items-center">
      {children}
    </div>
  );
}

export default LoginLayout;