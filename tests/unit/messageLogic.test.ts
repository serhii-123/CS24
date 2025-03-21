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
});

describe("formatMessageForDisplay", () => {
  it("should format the message correctly", () => {
    const message = {
      id: 1,
      senderName: "Alice",
      recipientName: "Bob",
      content: "Hi Bob!",
      created_at: new Date("2025-03-21T10:00:00"),
    };
    const formatted = formatMessageForDisplay(message);
    // Check that the formatted string contains expected parts.
    expect(formatted).toContain("Alice");
    expect(formatted).toContain("Bob");
    expect(formatted).toContain("Hi Bob!");
  });
});

describe("sanitizeContent", () => {
  it("should replace < and > with safe HTML entities", () => {
    const unsafeContent = '<script>alert("xss")</script>';
    const safeContent = sanitizeContent(unsafeContent);
    expect(safeContent).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;');
  });

  it("should leave safe content unchanged", () => {
    const safeContent = "Hello world!";
    expect(sanitizeContent(safeContent)).toBe(safeContent);
  });
});

// For homework, you can assign tasks such as:

// Extend Validation:

// Add additional rules (e.g., check that sender and recipient are not the same, or disallow certain words).
// Write unit tests covering these new rules.
// Enhance Formatting:

// Update formatMessageForDisplay to include additional information, such as a message status (e.g., “sent” or “read”).
// Create tests to verify the updated output format.
// Content Sanitization:

// Improve the sanitizeContent function to handle additional edge cases (e.g., handling quotes or other special characters).
// Write tests for various content strings to ensure they are sanitized correctly.
