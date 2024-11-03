import { Router } from "express";
import { admin } from "../../middleware/admin.middleware.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { messageService } from "./message.service.js";

export const messageCtrl = Router();

messageCtrl.get("/", requireAuth, async (req, res) => {
  try {
    const messages = await messageService.query();

    res.send(messages);
  } catch (error) {
    res.status(400).send(error);
  }
});

messageCtrl.get("/:messageId", requireAuth, async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await messageService.getById(messageId);

    res.send(message);
  } catch (error) {
    res.status(400).send(error);
  }
});

messageCtrl.post("/", requireAuth, async (req, res) => {
  const { message } = req.body;
  const messageToSave = {
    txt: message.txt,
  };

  try {
    const savedMessage = await messageService.save(messageToSave);

    res.send(savedMessage);
  } catch (error) {
    res.status(400).send(error);
  }
});

messageCtrl.put("/:messageId", requireAuth, async (req, res) => {
  const { message } = req.body;
  const messageToSave = {
    txt: message.txt,
  };

  try {
    const savedMessage = await messageService.save(messageToSave);

    res.send(savedMessage);
  } catch (error) {
    res.status(400).send(error);
  }
});

messageCtrl.delete("/:messageId", requireAuth, admin, async (req, res) => {
  const { messageId } = req.params;

  try {
    await messageService.remove(messageId);

    res.send("OK");
  } catch (error) {
    res.status(400).send(error);
  }
});
