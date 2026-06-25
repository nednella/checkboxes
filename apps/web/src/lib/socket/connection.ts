type SocketConnectionHandlers = {
  onOpen?: () => void;
  onMessage?: (event: MessageEvent) => void;
  onError?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
};

type SocketConnectionOptions = {
  url: string;
  handlers: SocketConnectionHandlers;
};

export class SocketConnection {
  private readonly url: string;
  private readonly handlers: SocketConnectionHandlers;

  private ws: WebSocket | null = null;

  constructor(options: SocketConnectionOptions) {
    this.url = options.url;
    this.handlers = options.handlers;
  }

  connect(): void {
    if (this.ws) return;

    const ws = new WebSocket(this.url);
    this.ws = ws;

    ws.onopen = () => this.handlers.onOpen?.();
    ws.onmessage = (event: MessageEvent) => this.handlers.onMessage?.(event);
    ws.onerror = (event) => this.handlers.onError?.(event);
    ws.onclose = (event: CloseEvent) => this.handlers.onClose?.(event);
  }

  disconnect(): void {
    this.ws?.close();
  }

  send(data: unknown): void {
    if (this.ws?.readyState === WebSocket.CONNECTING) return;
    this.ws?.send(JSON.stringify(data));
  }
}
