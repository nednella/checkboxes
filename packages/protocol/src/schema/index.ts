import z from "zod";

import { MessageCodec } from "../codec/index.js";

export const clientMessageSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("heartbeat") }),
  z.object({ type: z.literal("flip"), payload: z.number() })
]);

export const serverMessageSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("heartbeat") }),
  z.object({ type: z.literal("message"), payload: z.string() }),
  z.object({ type: z.literal("snapshot"), payload: z.array(z.boolean()) })
]);

export type ClientMessage = z.infer<typeof clientMessageSchema>;
export type ServerMessage = z.infer<typeof serverMessageSchema>;

export const clientCodec = new MessageCodec<ClientMessage>(clientMessageSchema);
export const serverCodec = new MessageCodec<ServerMessage>(serverMessageSchema);
