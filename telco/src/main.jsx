import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Telco from "./Telco.jsx";
import Plans from "./Plans.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Telco />
    <Plans />
  </StrictMode>,
);
