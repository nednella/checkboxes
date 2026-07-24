import type { ServerMessage } from "@checkboxes/shared/protocol";

export type SocketError =
  | {
      type: "socket";
      event: Event;
    }
  | {
      type: "protocol";
      reason: "invalid-json" | "invalid-message";
    };

export type SocketConnectionHandlers = {
  onOpen?: () => void;
  onMessage?: (message: ServerMessage) => void;
  onError?: (error: SocketError) => void;
  onClose?: (event: CloseEvent) => void;
  onReconnectFailed?: () => void;
};

export type SocketConnectionOptions = {
  url: string;
  maxRetries?: number;
  connectionTimeoutMs?: number;
  reconnectDelayMs?: number;
  handlers: SocketConnectionHandlers;
};

export type SocketStatus = "connecting" | "reconnecting" | "open" | "closed";
