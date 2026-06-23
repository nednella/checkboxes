import { useEffect, useRef, useState } from "react";

function App() {
  const [count, setCount] = useState<number>(-1);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000/socket");
    wsRef.current = ws;

    ws.onmessage = (evt: MessageEvent<string>) => {
      const msg = JSON.parse(evt.data);
      if (msg.type === "count") setCount(msg.count);
      else console.log(msg);
    };

    return () => ws.close();
  }, []);

  const handleUp = () => wsRef.current?.send("increment");
  const handleDown = () => wsRef.current?.send("decrement");

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center gap-6">
      <h1>checkboxes</h1>
      <p>{count}</p>
      <div className="flex gap-6">
        <button
          onClick={handleUp}
          className="border px-6 py-2"
        >
          up
        </button>
        <button
          onClick={handleDown}
          className="border px-6 py-2"
        >
          down
        </button>
      </div>
    </div>
  );
}

export default App;
