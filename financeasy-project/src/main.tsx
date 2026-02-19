import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeAutoProvider } from "./contexts/ThemeAutoProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeAutoProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeAutoProvider>
  </StrictMode>
);
