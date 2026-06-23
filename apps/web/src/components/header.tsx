import { ARRAY_SIZE } from "@checkboxes/shared";

import { useSocket } from "../hooks/use-socket";

export default function Header() {
  const { snapshot } = useSocket();
  const count = snapshot.filter(Boolean).length;

  return (
    <div className="text-center">
      <h1 className="text-2xl font-normal">checkboxes</h1>
      <p>
        {count} / {ARRAY_SIZE}
      </p>
    </div>
  );
}
