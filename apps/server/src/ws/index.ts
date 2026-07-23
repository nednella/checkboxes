import type { Server } from "node:http";

import { WebSocket, WebSocketServer } from "ws";

import { ARRAY_SIZE, SOCKET_PATH } from "@checkboxes/shared/constants";
import { clientCodec, serverCodec, type ClientMessage } from "@checkboxes/shared/protocol";

import { registerConnectionHeartbeat, registerServerHeartbeat } from "./heartbeat.js";
import type { CheckboxesWebSocket } from "./types.js";

const checkboxes: boolean[] = new Array(ARRAY_SIZE).fill(false);

export default function attachWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server, path: SOCKET_PATH });
  registerServerHeartbeat(wss);

  wss.on("connection", (ws: CheckboxesWebSocket) => {
    registerConnectionHeartbeat(ws);

    ws.send(serverCodec.encode({ type: "message", payload: "Welcome! You have connected to the checkboxes WSS" }));
    ws.send(serverCodec.encode({ type: "snapshot", payload: checkboxes }));

    ws.on("error", console.error);

    ws.on("message", (raw: WebSocket.RawData) => {
      const result = clientCodec.decode(raw.toString());
      if (!result.ok) {
        console.log("[SERVER] decode error: ", result.reason, raw.toString());
        return;
      }

      const message: ClientMessage = result.data;

      if (message.type === "flip") {
        checkboxes[message.payload] = !checkboxes[message.payload];

        wss.clients.forEach((client) => {
          client.send(serverCodec.encode({ type: "snapshot", payload: checkboxes }));
        });
      }
    });

    ws.on("close", (code, reason) => {
      console.log("[SERVER] disconnected [%s, %s] (%s)", code, reason.toString(), new Date());
    });
  });

  return wss;
}
