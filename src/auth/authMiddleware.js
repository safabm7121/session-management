import { JwtService } from "./jwtService.js";
import { Errors } from "../core/errors.js";

export function requireAuth(req, res, next) {
  const h = req.headers.authorization || "";
  const parts = h.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Missing bearer token" });
  }
  const payload = JwtService.verify(parts[1]);
  if (!payload) return res.status(403).json({ error: "Invalid token" });
  req.auth = payload;
  next();
}
