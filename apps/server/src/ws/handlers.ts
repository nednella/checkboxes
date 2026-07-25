import type { WebSocket, WebSocketServer } from "ws";

import { clientCodec, serverCodec, type ClientMessage } from "@checkboxes/protocol";

import { markAlive } from "./heartbeat.js";
import { checkboxes } from "./state.js";
import type { CheckboxesWebSocket } from "./types.js";

export function onClose(code: number, reason: Buffer) {
  console.log("[SERVER] disconnected [%s, %s] (%s)", code, reason.toString(), new Date());
}

export function onConnection(ws: CheckboxesWebSocket) {
  console.log("[SERVER] connected (%s)", new Date());
  markAlive(ws);
  ws.send(serverCodec.encode({ type: "message", payload: "Welcome! You have connected to the checkboxes WSS" }));
  ws.send(serverCodec.encode({ type: "snapshot", payload: checkboxes }));
}

export function onMessage(ws: CheckboxesWebSocket, wss: WebSocketServer, raw: WebSocket.RawData) {
  markAlive(ws);

  const result = clientCodec.decode(raw.toString());
  if (!result.ok) {
    console.log("[SERVER] decode error: ", result.reason, raw.toString());
    return;
  }

  const message: ClientMessage = result.data;

  if (message.type === "heartbeat") {
    console.log("[SERVER] ping received (%s)", new Date());
  }

  if (message.type === "flip") {
    checkboxes[message.payload] = !checkboxes[message.payload];

    wss.clients.forEach((client) => {
      client.send(serverCodec.encode({ type: "snapshot", payload: checkboxes }));
    });
  }
}
