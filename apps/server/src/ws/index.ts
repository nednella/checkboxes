import type { Server } from "node:http";

import { WebSocket, WebSocketServer } from "ws";

import { ARRAY_SIZE, dateNow } from "@checkboxes/shared";

const checkboxes: boolean[] = new Array(ARRAY_SIZE).fill(false);

function createWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server, path: "/socket" });

  wss.on("connection", (ws) => {
    console.log("Socket connected: %s", dateNow());
    ws.send(JSON.stringify({ type: "message", message: "Welcome! You have connected to the WSS" }));
    ws.send(JSON.stringify({ type: "snapshot", snapshot: checkboxes }));

    ws.on("error", console.error);

    const pingInterval = setInterval(() => ws.ping(), 10_000);

    ws.on("close", (code, reason) => {
      clearInterval(pingInterval);
      console.log("Socket disconnected [%s, %s]: %s", code, reason.toString(), dateNow());
    });

    ws.on("message", (data: WebSocket.RawData) => {
      const message = JSON.parse(data.toString());
      console.log("received: %s", message);

      if (message.type === "flip") {
        checkboxes[message.index] = !checkboxes[message.index];

        wss.clients.forEach((client) => {
          client.send(JSON.stringify({ type: "snapshot", snapshot: checkboxes }));
        });
      }
    });

    ws.on("ping", () => console.log("Received ping: %s", dateNow()));
    ws.on("pong", () => console.log("Received pong: %s", dateNow()));
  });

  return wss;
}

export default createWebSocketServer;
