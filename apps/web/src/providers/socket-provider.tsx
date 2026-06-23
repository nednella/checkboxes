import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type SocketContext = {
  count: number;
  increment: () => void;
  decrement: () => void;
};

const SocketContext = React.createContext<SocketContext | null>(null);

type SocketProviderProps = {
  children: React.ReactNode;
};

function SocketProvider({ children }: SocketProviderProps) {
  const ws = useRef<WebSocket | null>(null);
  const [count, setCount] = useState<number>(-1);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3000/socket");

    ws.current.onmessage = (evt: MessageEvent<string>) => {
      const msg = JSON.parse(evt.data);
      if (msg.type === "count") setCount(msg.count);
      else console.log(msg);
    };

    return () => ws.current?.close();
  }, []);

  const increment = useCallback(() => ws.current?.send("increment"), [ws]);
  const decrement = useCallback(() => ws.current?.send("decrement"), [ws]);

  const value = useMemo(
    () => ({
      count,
      increment,
      decrement
    }),
    [count, increment, decrement]
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export { SocketContext, SocketProvider };
