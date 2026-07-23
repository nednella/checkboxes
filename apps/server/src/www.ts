import http from "node:http";

import { SOCKET_PATH } from "@checkboxes/shared/constants";

import app from "./app/server.js";
import config from "./config.js";
import attachWebSocketServer from "./ws/server.js";

const { host, port } = config;

const server = http.createServer(app);
attachWebSocketServer(server);

server.listen(port, host, () => {
  console.log("HTTP server now listening on http://%s:%d", host, port);
  console.log("WebSocket server now listening on ws://%s:%d%s", host, port, SOCKET_PATH);
});
