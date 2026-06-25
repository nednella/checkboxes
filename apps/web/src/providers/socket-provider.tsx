import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { SocketConnection } from "../lib/socket/connection";

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
      url: "ws://localhost:3000/socket",
      handlers: {
        onMessage: (evt) => {
          const msg = JSON.parse(evt.data);
          if (msg.type === "snapshot") setSnapshot(msg.snapshot);
          else console.log(msg);
        }
      }
    });

    wsRef.current = ws;
    ws.connect();

    return () => ws.disconnect();
  }, []);

  const flip = useCallback((index: number) => wsRef.current?.send({ type: "flip", index }), [wsRef]);

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
