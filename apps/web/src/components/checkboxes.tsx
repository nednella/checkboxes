import { ARRAY_SIZE } from "@checkboxes/shared";

import { useSocket } from "../hooks/use-socket";

export default function Checkboxes() {
  const { snapshot, flip } = useSocket();
  const cols = Math.ceil(Math.sqrt(ARRAY_SIZE));

  return (
    <div
      className="m-auto grid w-fit gap-2"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {snapshot.map((_, i) => (
        <input
          key={i}
          className="size-6"
          type="checkbox"
          checked={snapshot[i]}
          onChange={() => flip(i)}
        />
      ))}
    </div>
  );
}
