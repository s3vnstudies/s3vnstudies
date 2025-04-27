import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { applyViteWebSocketFix } from "./vite-websocket-fix";

// Apply the WebSocket fix to prevent Vite client errors
// This needs to run before any Vite HMR WebSocket connections are created
applyViteWebSocketFix();

// Render the application
createRoot(document.getElementById("root")!).render(
  <App />
);
