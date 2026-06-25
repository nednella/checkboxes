import http from "node:http";

import app from "./app/index.js";
import attachWebSocketServer from "./ws/index.js";

process.loadEnvFile();

const PORT = Number(process.env.PORT) || 3000;

const server = http.createServer(app);
attachWebSocketServer(server);

server.listen(PORT, () => {
  console.log("HTTP server now listening on port %d.", PORT);
});
