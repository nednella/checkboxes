import type { Server } from "node:http";

import { WebSocket, WebSocketServer } from "ws";

import { SOCKET_PATH } from "@checkboxes/shared/constants";

import { onClose, onConnection, onMessage } from "./handlers.js";
import { registerServerHeartbeat } from "./heartbeat.js";
import type { CheckboxesWebSocket } from "./types.js";

export default function attachWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server, path: SOCKET_PATH });
  registerServerHeartbeat(wss);

  wss.on("connection", (ws: CheckboxesWebSocket) => {
    onConnection(ws);
    ws.on("close", onClose);
    ws.on("error", console.error);
    ws.on("message", (raw: WebSocket.RawData) => onMessage(ws, wss, raw));
  });

  return wss;
}
