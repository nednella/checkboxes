import type { WebSocketServer } from "ws";

import { serverCodec } from "@checkboxes/shared/protocol";

import type { CheckboxesWebSocket } from "./types.js";

const SERVER_HEARTBEAT_INTERVAL_MS = 10_000;
const SOCKET_MAX_MISSED_PONGS = 2;

/**
 * Socket server pings every connection on an interval and terminates any connections
 * that miss `SOCKET_MAX_MISSED_PONGS` consecutive pongs.
 *
 * The per-connection counter is incremented before a ping. An active connection's pong
 * will reset the counter back to 0, so only a dead connection accumulates misses.
 *
 * @param wss WebSocketServer to register a heartbeat to
 */
export function registerServerHeartbeat(wss: WebSocketServer) {
  const id = setInterval(() => {
    wss.clients.forEach((ws: CheckboxesWebSocket) => {
      if (ws.readyState === ws.CONNECTING || ws.missedPongs === undefined) {
        return;
      }

      if (ws.missedPongs >= SOCKET_MAX_MISSED_PONGS) {
        console.log("[SERVER] pruning dead connection (%s)", new Date());
        return ws.terminate();
      }

      ws.missedPongs++;
      ws.send(serverCodec.encode({ type: "heartbeat" }));
    });
  }, SERVER_HEARTBEAT_INTERVAL_MS);

  wss.on("close", () => clearInterval(id));
}

/**
 * Invoke any time a message is received from a connection to keep that socket alive.
 *
 * @param ws CheckboxesWebSocket connection to mark as alive
 */
export function markAlive(ws: CheckboxesWebSocket) {
  ws.missedPongs = 0;
}
