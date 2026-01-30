import { useState } from "react";
import "./styles/global.css";
import { Home } from "./pages/Home";
import { Header } from "./components/layout/Header";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Home></Home>
    </>
  );
}

export default App;
