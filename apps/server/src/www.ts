import http from "node:http";

import { SOCKET_PATH } from "@checkboxes/shared";

import app from "./app/index.js";
import config from "./config.js";
import attachWebSocketServer from "./ws/index.js";

const { host, port } = config;

const server = http.createServer(app);
attachWebSocketServer(server);

server.listen(port, host, () => {
  console.log("HTTP server now listening on http://%s:%d", host, port);
  console.log("WebSocket server now listening on ws://%s:%d%s", host, port, SOCKET_PATH);
});
