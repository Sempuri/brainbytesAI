import express from "express";
import { saveMessage, getMessagesBySession } from "./messageService.js";


const router = express.Router();

router.get("/", async (req, res) => {
  const { session } = req.query;
  if (!session) {
    return res.status(400).json({ status: "error", message: "Missing session" });
  }
  const messages = await getMessagesBySession(session);
  res.status(200).json(messages);
});

router.post("/", async (req, res) => {
  const { session, message } = req.body;
  if (!session || !message) {
    return res.status(400).json({ status: "error", message: "Missing required fields" });
  }
  const savedMessage = await saveMessage(session, message);
  res.status(201).json({ status: "success", savedMessage });
});

export default router;
