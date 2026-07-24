import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { SOCKET_PATH } from "@checkboxes/shared/constants";

import { SocketConnection } from "../lib/socket/connection";

const HOST = import.meta.env.VITE_SERVER_HOST || "localhost";
const PORT = import.meta.env.VITE_SERVER_PORT || "3000";
const WS_URL = `ws://${HOST}:${PORT}${SOCKET_PATH}`;

type SocketContext = {
  snapshot: boolean[];
  flip: (index: number) => void;
};

const SocketContext = React.createContext<SocketContext | null>(null);

function SocketProvider({ children }: { children: React.ReactNode }) {
  const wsRef = useRef<SocketConnection | null>(null);
  const [snapshot, setSnapshot] = useState<boolean[]>(new Array(0));

  useEffect(() => {
    const ws = new SocketConnection({
      url: WS_URL,
      handlers: {
        onOpen: () => console.log("[SOCKET] connected (%s)", new Date().toISOString()),
        onMessage: (message) => {
          switch (message.type) {
            case "heartbeat":
              ws.send({ type: "heartbeat" });
              break;
            case "snapshot":
              setSnapshot(message.payload);
              break;
            default:
              console.log(message);
          }
        },
        onError: (event) => console.error("[SOCKET] error!", event),
        onClose: (event) => console.log("[SOCKET] disconnected [%s] (%s)", event.code, new Date().toISOString()),
        onReconnectFailed: () => console.warn("[SOCKET] reconnect failed — giving up (%s)", new Date().toISOString())
      }
    });

    wsRef.current = ws;
    ws.connect();

    return () => ws.disconnect();
  }, []);

  const flip = useCallback((index: number) => wsRef.current?.send({ type: "flip", payload: index }), [wsRef]);

  const value = useMemo(
    () => ({
      snapshot,
      flip
    }),
    [snapshot, flip]
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export { SocketContext, SocketProvider };
