import { Router } from "express";
import { admin } from "../../middleware/admin.middleware.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { userService } from "./user.service.js";

export const userCtrl = Router();

userCtrl.get("/", requireAuth, admin, async (req, res) => {
  try {
    const users = await userService.query();

    res.send(users);
  } catch (error) {
    res.status(400).send(error);
  }
});

userCtrl.get("/:userId", requireAuth, admin, async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await userService.getById(userId);

    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

userCtrl.post("/", requireAuth, admin, async (req, res) => {
  const { user } = req.body;
  const userToSave = {
    username: user.username,
    password: user.password,
    fullName: user.fullName,
  };

  try {
    const savedUser = await userService.save(userToSave);

    res.send(savedUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

// userCtrl.put("/:userId", requireAuth, admin, async (req, res) => {
//   const { score } = req.body;
//   const userToSave = { ...req.body, score: +score };
//
//   try {
//     const savedUser = await userService.save(userToSave);
//
//     res.send(savedUser);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

userCtrl.delete("/:userId", requireAuth, admin, async (req, res) => {
  const { userId } = req.params;

  try {
    await userService.remove(userId);

    res.send("OK");
  } catch (error) {
    res.status(400).send(error);
  }
});
