import type { Context, MiddlewareFn } from "telegraf";
import { CONFIG } from "../config";

export function checkIsAdmin(userId: number | string): boolean {
  return CONFIG.ADMIN_IDS.includes(String(userId));
}

// Admin check middleware
export const isAdmin: MiddlewareFn<Context> = async (ctx, next) => {
  const id = ctx.from?.id;
  if (id && checkIsAdmin(id)) return next();
  return ctx.reply("⛔️ Admins only.");
};
