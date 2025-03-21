import { describe, it, expect, vi } from "vitest";
import { createMessage, getMessages } from "../../src/services/messages";
import { db } from "../../src/db";

describe("createMessage", () => {
  it("should create a message with sender and recipient IDs", async () => {
    const fakeMessage = {
      id: 1,
      senderId: 1,
      recipientId: 2,
      content: "Hello",
      created_at: new Date(),
    };

    // Mock the insert chain of the DB call:
    const returningMock = vi.fn().mockResolvedValue([fakeMessage]);
    const valuesMock = vi.fn().mockReturnValue({ returning: returningMock });
    const insertMock = vi
      .spyOn(db, "insert")
      .mockReturnValue({ values: valuesMock } as any);

    const message = await createMessage(1, 2, "Hello");
    expect(message).toEqual(fakeMessage);

    // Restore the original implementation
    insertMock.mockRestore();
  });
});

describe("getMessages", () => {
  it("should return an empty array when no messages exist", async () => {
    const selectMock = vi.spyOn(db, "select").mockReturnValue({
      from: vi.fn().mockResolvedValue([]),
    } as any);

    const messages = await getMessages();
    expect(messages).toEqual([]);

    selectMock.mockRestore();
  });

  it("should return an array of messages", async () => {
    const fakeMessages = [
      {
        id: 1,
        senderId: 1,
        recipientId: 2,
        content: "Hello",
        created_at: new Date(),
      },
      {
        id: 2,
        senderId: 2,
        recipientId: 1,
        content: "Hi",
        created_at: new Date(),
      },
    ];
    const fromMock = vi.fn().mockResolvedValue(fakeMessages);
    const selectMock = vi.spyOn(db, "select").mockReturnValue({
      from: fromMock,
    } as any);

    const messages = await getMessages();
    expect(messages).toEqual(fakeMessages);

    selectMock.mockRestore();
  });
});
