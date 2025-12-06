// routes/chat.js
import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";
const router = express.Router();

router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "xyz",
      title: "Testing new thread"
    });

    const response = await thread.save();
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to save in Database" });
  }
});

// get all threads
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetched threads" });
  }
});

router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOne({ threadId });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    return res.json(thread.messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });
    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    return res.status(200).json({ success: "Thread deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

// ===== corrected /chat handler =====
router.post("/chat", async (req, res) => {
  console.log("=== /api/chat called ===");
  console.log("content-type:", req.headers["content-type"]);
  console.log("raw req.body:", req.body);

  // Defensive destructure so req.body undefined won't crash
  const { threadId, messages } = req.body ?? {};

  if (!threadId || !messages) {
    return res.status(400).json({
      error: "missing required fields: threadId and/or messages",
      received: req.body
    });
  }

  try {
    let thread = await Thread.findOne({ threadId });
    if (!thread) {
      // create a new thread in DB
      thread = new Thread({
        threadId,
        title: typeof messages === "string" ? messages.slice(0, 50) : "New thread",
        messages: [{ role: "user", content: messages }]
      });
    } else {
      thread.messages.push({ role: "user", content: messages });
    }

    const assistantreply = await getOpenAIAPIResponse(messages);
    thread.messages.push({ role: "assistant", content: assistantreply });
    thread.updatedAt = new Date();
    await thread.save();
    return res.json({ reply: assistantreply });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "something went wrong" });
  }
});

export default router;
