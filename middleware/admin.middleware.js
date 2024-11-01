import { authService } from "../api/auth/auth.service.js";

export function admin(req, res, next) {
  const loggedInUser = authService.validateToken(req.cookies.loginToken);

  if (loggedInUser.role !== "admin")
    return res.status(403).send("Unauthorized");

  req.loggedInUser = loggedInUser;

  next();
}
