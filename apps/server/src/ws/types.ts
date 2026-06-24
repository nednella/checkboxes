import { WebSocket } from "ws";

export type CheckboxesWebSocket = WebSocket & {
  missedPongs?: number;
};
