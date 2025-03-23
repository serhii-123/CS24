import { describe, it, expect } from "vitest";
import {
  validateMessageInput,
  formatMessageForDisplay,
  sanitizeContent,
} from "../../src/services/messageService";

describe("validateMessageInput", () => {
  it("should return valid for correct input", () => {
    const result = validateMessageInput(1, 2, "Hello world");
    expect(result.valid).toBe(true);
  });

  it("should return an error for an invalid sender ID", () => {
    const result = validateMessageInput(0, 2, "Hello world");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Invalid sender ID");
  });

  it("should return an error for an invalid recipient ID", () => {
    const result = validateMessageInput(1, -5, "Hello world");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Invalid recipient ID");
  });

  it("should return an error for empty content", () => {
    const result = validateMessageInput(1, 2, "   ");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Content cannot be empty");
  });

  it("should return an error for content that is too long", () => {
    const longContent = "a".repeat(501);
    const result = validateMessageInput(1, 2, longContent);
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Content is too long");
  });

  it('should return an error for content that contains disallowed word', () => {
    const content = 'Hello cRap';
    const result = validateMessageInput(1, 2, content);

    expect(result.valid).toBe(false);
    expect(result.error).toBe('Content contains disallowed word');
  });

  it('should return an error because of the same sender and partipient ids', () => {
    const result = validateMessageInput(1, 1, 'Hello');
    
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Sender and recipient ids cannot be the same');
  })
});

describe("formatMessageForDisplay", () => {
  it("should format the message correctly", () => {
    const message = {
      id: 1,
      senderName: "Alice",
      recipientName: "Bob",
      content: "Hi Bob!",
      status: 'read' as ('read' | 'sent'),
      created_at: new Date("2025-03-21T10:00:00"),
    };
    const formatted = formatMessageForDisplay(message);
    // Check that the formatted string contains expected parts.
    expect(formatted).toContain("Alice");
    expect(formatted).toContain("Bob");
    expect(formatted).toContain("Hi Bob!");
  });
  it('should return a certain message', () => {
    const message = {
      id: 1,
      senderName: 'Alex',
      recipientName: 'Sashko',
      content: 'Wsp bro',
      status: 'sent' as ('read' | 'sent'),
      created_at: new Date('2025-03-21T10:00:00'),
    };
    const formatted: string = formatMessageForDisplay(message);

    expect(formatted).toContain('Alex');
    expect(formatted).toContain('Wsp bro');
    expect(formatted).toContain('Status: sent');
  })
});

describe("sanitizeContent", () => {
  it("should replace < and > with safe HTML entities", () => {
    const unsafeContent = '<script>alert("xss")</script>';
    const safeContent = sanitizeContent(unsafeContent);
    expect(safeContent).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  });

  it("should leave safe content unchanged", () => {
    const safeContent = "Hello world!";
    expect(sanitizeContent(safeContent)).toBe(safeContent);
  });

  it('should replace ~ and \' with safe HTML entities and unicode code', () => {
    const unsafeContent: string = "This cost ~300 bucks, some 'thing'";
    const safeContent: string = sanitizeContent(unsafeContent);

    expect(safeContent).toBe('This cost &#126;300 bucks, some &apos;thing&apos;')
  });

  it('should replace " with safe HTML entities', () => {
    const unsafeContent: string = 'Yeah, it looks "amazing"';
    const safeContent: string = sanitizeContent(unsafeContent);

    expect(safeContent).toBe('Yeah, it looks &quot;amazing&quot;');
  })
});
