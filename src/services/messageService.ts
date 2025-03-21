/**
 * Validates the input for creating a message.
 * Returns an object indicating whether the input is valid and, if not, an error message.
 */
export function validateMessageInput(
  senderId: number,
  recipientId: number,
  content: string
): { valid: boolean; error?: string } {
  if (senderId <= 0) return { valid: false, error: "Invalid sender ID" };
  if (recipientId <= 0) return { valid: false, error: "Invalid recipient ID" };
  if (!content || content.trim() === "")
    return { valid: false, error: "Content cannot be empty" };
  if (content.length > 500)
    return { valid: false, error: "Content is too long" };
  return { valid: true };
}

/**
 * Formats a message for display purposes.
 * Assumes the message object includes sender and recipient names.
 */
export function formatMessageForDisplay(message: {
  id: number;
  senderName: string;
  recipientName: string;
  content: string;
  created_at: Date;
}): string {
  const dateString = message.created_at.toLocaleString();
  return `[${dateString}] ${message.senderName} -> ${message.recipientName}: ${message.content}`;
}

/**
 * Sanitizes message content by replacing potentially dangerous characters.
 * This is a basic implementation to prevent XSS attacks by escaping < and >.
 */
export function sanitizeContent(content: string): string {
  return content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
