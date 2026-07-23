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
        onOpen: () => console.log("[socket] connected"),
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
        onError: (evt) => console.error("[socket] error", evt),
        onClose: (evt) => console.log(`[socket] disconnected (${evt.code})`),
        onReconnectFailed: () => console.warn("[socket] reconnect failed — giving up")
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
