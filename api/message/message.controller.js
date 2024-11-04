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

messageCtrl.post("/", requireAuth, async (req, res) => {
  try {
    const { message } = req.body;
    const { aboutBugId } = message;
    const user = req.loggedInUser;

    message.aboutBugId = aboutBugId;
    message.byUserId = user._id;

    const savedMessage = await messageService.save(message);

    delete savedMessage.aboutBugId;
    delete savedMessage.byUserId;

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
