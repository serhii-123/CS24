import { encodeHTML } from "entities";

/**
 * Validates the input for creating a message.
 * Returns an object indicating whether the input is valid and, if not, an error message.
 */
export function validateMessageInput(
  senderId: number,
  recipientId: number,
  content: string
): { valid: boolean; error?: string } {
  const forbiddenWords: string[] = ['damn', 'shit', 'crap'];

  if (senderId <= 0)
    return { valid: false, error: "Invalid sender ID" };
  if(recipientId <= 0)
    return { valid: false, error: "Invalid recipient ID" };
  if(senderId == recipientId)
    return { valid: false, error: 'Sender and recipient ids cannot be the same' };
  if (!content || content.trim() === "")
    return { valid: false, error: "Content cannot be empty" };
  if (content.length > 500)
    return { valid: false, error: "Content is too long" };

  for(let x of forbiddenWords) {
    if(content.toLocaleLowerCase().includes(x))
      return { valid: false, error: 'Content contains disallowed word' };
  }

  return { valid: true };
}

/**
 * Formats a message for display purposes.
 * Assumes the message object includes sender and recipient names.
 */
export function formatMessageForDisplay(msg: {
  id: number;
  senderName: string;
  recipientName: string;
  content: string;
  status: 'sent' | 'read';
  created_at: Date;
}): string {
  const dateString = msg.created_at.toLocaleString();
  return `[${dateString}] ${msg.senderName} -> ${msg.recipientName}: ${msg.content} \nStatus: ${msg.status}`;
}

/**
 * Sanitizes message content by replacing potentially dangerous characters.
 * This is a basic implementation to prevent XSS attacks by escaping < and >.
 */
export function sanitizeContent(content: string): string {
  const disallowedSymbols: string[] = ['<', '>', '\'', '"', '`', '~'];
  let result = content;

  for(let s of disallowedSymbols) {
    const re: RegExp = new RegExp(s, 'g');
    const htmlEntity: string = encodeHTML(s);

    console.log(htmlEntity);
    result = result.replace(re, htmlEntity);
  }

  result = result.replace(/~/g, '&#126;');

  return result;
}
