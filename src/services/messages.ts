import { db } from "../db";
import { Message, messages } from "../models/schema";

export async function createMessage(
  senderId: number,
  recipientId: number,
  content: string
): Promise<Message> {
  const result = await db
    .insert(messages)
    .values({
      senderId,
      recipientId,
      content,
      createdAt: new Date(),
    })
    .returning();

  // Assuming the ORM returns an array with one element
  return result[0];
}

export async function getMessages(): Promise<Message[]> {
  return db.select().from(messages);
}
