import { clientCodec, serverCodec, type ClientMessage } from "@checkboxes/protocol";

import { exponentialBackoff } from "./backoff";
import type { SocketConnectionHandlers, SocketConnectionOptions, SocketStatus } from "./types";

const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_CONNECTION_TIMEOUT_MS = 30_000;
const DEFAULT_RECONNECT_DELAY_MS = 3_000;

export class SocketConnection {
  private readonly url: string;
  private readonly maxRetries: number;
  private readonly connectionTimeoutMs: number;
  private readonly reconnectDelayMs: number;
  private readonly handlers: SocketConnectionHandlers;

  private ws: WebSocket | undefined;
  private _status: SocketStatus = "closed";
  private retries: number = 0;
  private watchTimer: ReturnType<typeof setTimeout> | undefined;
  private reconnectTimer: ReturnType<typeof setTimeout> | undefined;

  constructor(options: SocketConnectionOptions) {
    this.url = options.url;
    this.maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
    this.connectionTimeoutMs = options.connectionTimeoutMs ?? DEFAULT_CONNECTION_TIMEOUT_MS;
    this.reconnectDelayMs = options.reconnectDelayMs ?? DEFAULT_RECONNECT_DELAY_MS;
    this.handlers = options.handlers;
  }

  connect(): void {
    this.setup();
  }

  disconnect(): void {
    this.teardown();
  }

  send(data: ClientMessage): void {
    if (this.ws?.readyState === WebSocket.CONNECTING) return;
    this.ws?.send(clientCodec.encode(data));
  }

  status(): SocketStatus {
    return this._status;
  }

  /**
   * Open a fresh socket and bind event listeners.
   */
  private setup(): void {
    if (this.ws) return;
    this._status = this.retries === 0 ? "connecting" : "reconnecting";

    const ws = new WebSocket(this.url);
    this.ws = ws;

    ws.onopen = () => {
      this.startConnectionWatcher();
      this.retries = 0;
      this._status = "open";
      this.handlers.onOpen?.();
    };

    ws.onmessage = (event: MessageEvent) => {
      this.startConnectionWatcher();

      const result = serverCodec.decode(event.data);
      if (!result.ok) {
        return this.handlers.onError?.({ type: "protocol", reason: result.reason });
      }

      this.handlers.onMessage?.(result.data);
    };

    ws.onerror = (event) => this.handlers.onError?.({ type: "socket", event });

    ws.onclose = (event: CloseEvent) => {
      this.handlers.onClose?.(event);
      this.attemptReconnect();
    };
  }

  /**
   * Dismantle the socket and any pending timers.
   */
  private teardown(): void {
    this._status = "closed";
    clearTimeout(this.watchTimer);
    clearTimeout(this.reconnectTimer);

    const ws = this.ws;
    if (!ws) return;

    ws.onopen = ws.onmessage = ws.onerror = ws.onclose = null;
    ws.close();
    this.ws = undefined;
  }

  /**
   * Dismantle the socket and attempt to schedule a fresh one.
   */
  private attemptReconnect(): void {
    this.teardown();

    if (this.retries >= this.maxRetries) {
      return this.handlers.onReconnectFailed?.();
    }

    const delay = exponentialBackoff(this.retries, this.reconnectDelayMs);
    this.reconnectTimer = setTimeout(() => this.setup(), delay);
    this.retries++;
  }

  /**
   * "Watches" the connection by scheduling a reconnect attempt after a fixed timeout delay,
   * which must reset any time a message is received from the server.
   */
  private startConnectionWatcher(): void {
    clearTimeout(this.watchTimer);
    this.watchTimer = setTimeout(() => this.attemptReconnect(), this.connectionTimeoutMs);
  }
}
