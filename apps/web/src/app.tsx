import Page from "./components/page";
import { useSocket } from "./hooks/useSocket";

function App() {
  const { count, increment, decrement } = useSocket();

  return (
    <Page>
      <h1 className="text-2xl font-normal">checkboxes</h1>
      <p>{count}</p>
      <div className="space-x-6">
        <button
          onClick={() => increment()}
          className="border px-6 py-2"
        >
          up
        </button>
        <button
          onClick={() => decrement()}
          className="border px-6 py-2"
        >
          down
        </button>
      </div>
    </Page>
  );
}

export default App;
