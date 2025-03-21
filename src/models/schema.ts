import * as p from "drizzle-orm/pg-core";

export const users = p.pgTable("users", {
  id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
  username: p.text().notNull(),
});

export const messages = p.pgTable("messages", {
  id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
  senderId: p.integer("sender_id").notNull(),
  recipientId: p.integer("recipient_id").notNull(),
  content: p.text().notNull(),
  createdAt: p.timestamp("created_at", { mode: "date" }).defaultNow(),
});

export type Message = typeof messages.$inferInsert;
