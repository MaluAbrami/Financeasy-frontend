import { useEffect, useState } from "react";
import "./styles/global.css";
import { Home } from "./pages/Home";
import { Header } from "./components/layout/Header";

function App() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      document.documentElement.classList.toggle("dark", mq.matches);
    };

    applyTheme();

    // compat: alguns browsers antigos usam addListener/removeListener
    if (mq.addEventListener) {
      mq.addEventListener("change", applyTheme);
      return () => mq.removeEventListener("change", applyTheme);
    } else {
      mq.addListener(applyTheme);
      return () => mq.removeListener(applyTheme);
    }
  }, []);

  return <Home />;
}

export default App;