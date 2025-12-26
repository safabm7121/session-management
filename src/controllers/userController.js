import { UserService } from "../realm/userService.js";

const DEFAULT_REALM = "default";

export async function getAllUsers(req, res) {
  res.json(UserService.getAll(DEFAULT_REALM));
}

export async function getUserById(req, res) {
  const user = UserService.getById(DEFAULT_REALM, Number(req.params.id));
  if (!user) return res.status(404).json({ error: "Not found" });
  const { passwordHash, refreshTokens, ...safe } = user;
  res.json(safe);
}

export async function deleteUser(req, res) {
  const ok = UserService.delete(DEFAULT_REALM, Number(req.params.id));
  if (!ok) return res.status(404).json({ error: "Not found" });
  res.json({ success: true });
}
