import { z } from "zod";

export type DecodeResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      reason: "invalid-json";
    }
  | {
      ok: false;
      reason: "invalid-message";
      error: z.ZodError;
    };

export class MessageCodec<T> {
  private readonly schema: z.ZodType<T>;

  constructor(schema: z.ZodType<T>) {
    this.schema = schema;
  }

  encode(message: T): string {
    return JSON.stringify(message);
  }

  decode(raw: string): DecodeResult<T> {
    let json: unknown;

    try {
      json = JSON.parse(raw);
    } catch {
      return {
        ok: false,
        reason: "invalid-json"
      };
    }

    const result = this.schema.safeParse(json);

    if (!result.success) {
      return {
        ok: false,
        reason: "invalid-message",
        error: result.error
      };
    }

    return {
      ok: true,
      data: result.data
    };
  }
}
