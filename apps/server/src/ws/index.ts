import type { Server } from "node:http";

import { WebSocket, WebSocketServer } from "ws";

import { ARRAY_SIZE } from "@checkboxes/shared";

import { registerConnectionHeartbeat, registerServerHeartbeat } from "./heartbeat.js";
import type { CheckboxesWebSocket } from "./types.js";

const checkboxes: boolean[] = new Array(ARRAY_SIZE).fill(false);

function createWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server, path: "/socket" });
  registerServerHeartbeat(wss);

  wss.on("connection", (ws: CheckboxesWebSocket) => {
    registerConnectionHeartbeat(ws);

    ws.send(JSON.stringify({ type: "message", message: "Welcome! You have connected to the WSS" }));
    ws.send(JSON.stringify({ type: "snapshot", snapshot: checkboxes }));

    ws.on("error", console.error);

    ws.on("message", (data: WebSocket.RawData) => {
      const message = JSON.parse(data.toString());
      console.log("[SERVER] received: %s", message);

      if (message.type === "flip") {
        checkboxes[message.index] = !checkboxes[message.index];

        wss.clients.forEach((client) => {
          client.send(JSON.stringify({ type: "snapshot", snapshot: checkboxes }));
        });
      }
    });

    ws.on("close", (code, reason) => {
      console.log("[SOCKET] disconnected [%s, %s] (%s)", code, reason.toString(), new Date());
    });
  });

  return wss;
}

export default createWebSocketServer;
