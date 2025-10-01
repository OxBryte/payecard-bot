import { Context } from "telegraf";

// Session interface for the bot
export interface BotSession {
  awaitingEmail?: boolean;
  awaitingBroadcast?: boolean;
}

export type BotContext = Context & { session: BotSession };
