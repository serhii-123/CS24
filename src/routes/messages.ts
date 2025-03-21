import { Hono } from "hono";
import { createMessage, getMessages } from "../services/messages";
import {
  validateMessageInput,
  sanitizeContent,
} from "../services/messageService";

const messagesRoutes = new Hono();

// GET /messages – retrieve all messages
messagesRoutes.get("/", async (c) => {
  const messages = await getMessages();
  return c.json(messages);
});

// POST /messages – create a new message
messagesRoutes.post("/", async (c) => {
  const body = await c.req.json();
  const { senderId, recipientId, content } = body;

  // Validate the input using business logic
  const validation = validateMessageInput(senderId, recipientId, content);
  if (!validation.valid) {
    return c.json({ error: validation.error }, 400);
  }

  // Sanitize the content
  const sanitizedContent = sanitizeContent(content);

  const message = await createMessage(senderId, recipientId, sanitizedContent);
  return c.json(message, 201);
});

export default messagesRoutes;
