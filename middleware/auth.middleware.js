import { authService } from "../api/auth/auth.service.js";

export function requireAuth(req, res, next) {
  const loggedInUser = authService.validateToken(req.cookies.loginToken);

  if (!loggedInUser) return res.status(401).send("Login first");

  req.loggedInUser = loggedInUser;

  next();
}
