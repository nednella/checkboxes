import type { WebSocketServer } from "ws";

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
        console.log("[SERVER] terminating connection (%s)", new Date());
        return ws.terminate();
      }

      ws.missedPongs++;
      ws.ping();
    });
  }, SERVER_HEARTBEAT_INTERVAL_MS);

  wss.on("close", () => clearInterval(id));
}

/**
 * Register a connection's `missedPongs` counter and resets every time it answers a ping.
 *
 * @param ws WebSocket to register a heartbeat to
 */
export function registerConnectionHeartbeat(ws: CheckboxesWebSocket) {
  console.log("[SOCKET] connected (%s)", new Date());
  ws.missedPongs = 0;

  ws.on("pong", () => {
    console.log("[SOCKET] ping received (%s)", new Date());
    ws.missedPongs = 0;
  });
}
