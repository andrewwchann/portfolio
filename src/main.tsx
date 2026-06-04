import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import PageBackground from "./components/PageBackground";
import { shaderAssetsReady } from "./components/shaderBackground";
import "./styles/index.css";

void shaderAssetsReady;

const bgRoot = document.getElementById("bg-root");
if (bgRoot) {
  createRoot(bgRoot).render(<PageBackground />);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
