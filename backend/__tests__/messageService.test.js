import { saveMessage, getMessagesBySession } from "./messageService.js";
import db from "../message.js";

jest.mock("../models");

test("saveMessage saves a message", async () => {
  db.Message.create.mockResolvedValue({ id: 1 });
  const res = await saveMessage("abc123", "Hi");
  expect(db.Message.create).toHaveBeenCalled();
  expect(res).toEqual({ id: 1 });
});

test("getMessagesBySession retrieves messages", async () => {
  db.Message.findAll.mockResolvedValue([{ message: "Hi" }]);
  const res = await getMessagesBySession("abc123");
  expect(res).toEqual(expect.arrayContaining([{ message: "Hi" }]));
});
