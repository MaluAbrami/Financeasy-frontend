import { useState } from "react";
import "./styles/global.css";
import { Home } from "./pages/Home";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Home></Home>
    </>
  );
}

export default App;
