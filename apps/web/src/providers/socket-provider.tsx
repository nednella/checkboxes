import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type SocketContext = {
  snapshot: boolean[];
  flip: (index: number) => void;
};

const SocketContext = React.createContext<SocketContext | null>(null);

function SocketProvider({ children }: { children: React.ReactNode }) {
  const ws = useRef<WebSocket | null>(null);
  const [snapshot, setSnapshot] = useState<boolean[]>(new Array(0));

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3000/socket");
    ws.current.onmessage = (evt: MessageEvent<string>) => {
      const msg = JSON.parse(evt.data);
      if (msg.type === "snapshot") setSnapshot(msg.snapshot);
      else console.log(msg);
    };

    return () => ws.current?.close();
  }, []);

  const flip = useCallback((index: number) => ws.current?.send(JSON.stringify({ type: "flip", index })), [ws]);

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
