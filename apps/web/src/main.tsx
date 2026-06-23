import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./app.tsx";

import "./main.css";

import { SocketProvider } from "./providers/socket-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocketProvider>
      <App />
    </SocketProvider>
  </StrictMode>
);
