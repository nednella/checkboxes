import { exponentialBackoff } from "../backoff";

type SocketConnectionHandlers = {
  onOpen?: () => void;
  onMessage?: (event: MessageEvent) => void;
  onError?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onReconnectFailed?: () => void;
};

type SocketConnectionOptions = {
  url: string;
  maxRetries?: number;
  connectionTimeoutMs?: number;
  reconnectDelayMs?: number;
  handlers: SocketConnectionHandlers;
};

type SocketStatus = "connecting" | "reconnecting" | "open" | "closed";

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
    this.maxRetries = options.maxRetries ?? 3;
    this.connectionTimeoutMs = options.connectionTimeoutMs ?? 30_000;
    this.reconnectDelayMs = options.reconnectDelayMs ?? 3_000;
    this.handlers = options.handlers;
  }

  connect(): void {
    this.setup();
  }

  disconnect(): void {
    this.teardown();
  }

  send(data: unknown): void {
    if (this.ws?.readyState === WebSocket.CONNECTING) return;
    this.ws?.send(JSON.stringify(data));
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
      this.handlers.onMessage?.(event);
    };

    ws.onerror = (event) => this.handlers.onError?.(event);

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
