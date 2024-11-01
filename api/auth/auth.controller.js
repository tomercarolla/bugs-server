import { Router } from "express";
import { log } from "../../middleware/log.middleware.js";
import { loggerService } from "../../services/logger.service.js";
import { authService } from "./auth.service.js";

export const authCtrl = Router();

authCtrl.post("/login", log, async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await authService.login(username, password);

    loggerService.info("User login: ", user);

    const loginToken = authService.getLoginToken(user);

    res.cookie("loginToken", loginToken, {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    });

    res.json(user);
  } catch (error) {
    loggerService.error("Failed to login", error);

    res.status(401).send({ error: "Failed to login" });
  }
});

authCtrl.post("/signup", log, async (req, res) => {
  try {
    const credentials = req.body;

    const account = await authService.signup(credentials);

    loggerService.debug(
      `auth.route - new account created: ` + JSON.stringify(account),
    );

    const user = await authService.login(
      credentials.username,
      credentials.password,
    );

    loggerService.info("User signup: ", user);

    const loginToken = authService.getLoginToken(user);

    res.cookie("loginToken", loginToken, {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    });

    res.json(user);
  } catch (error) {
    loggerService.error("Failed to signup", error);

    res.status(400).send({ error: "Failed to signup" });
  }
});

authCtrl.post("/logout", log, async (req, res) => {
  try {
    res.clearCookie("loginToken");
    res.send({ message: "Logged out successfully" });
  } catch {
    res.status(400).send({ error: "Failed to logout" });
  }
});
