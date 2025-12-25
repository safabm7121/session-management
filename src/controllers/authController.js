import bcrypt from "bcrypt";
import { Store } from "../storage/store.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../services/tokenService.js";

const register = async (req, res) => {
  const { email, password, name, roles } = req.body;
  if (Store.findUserByEmail(email))
    return res.status(409).json({ error: "Email exists" });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = Store.createUser({
    email,
    passwordHash,
    name,
    roles: roles || ["user"],
  });
  res
    .status(201)
    .json({
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles,
    });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = Store.findUserByEmail(email);
  if (!user || !user.isActive)
    return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const accessToken = signAccessToken(
    { sub: String(user.id), email: user.email, roles: user.roles },
    process.env.ACCESS_TOKEN_SECRET,
    process.env.ACCESS_TOKEN_TTL
  );
  const refreshToken = signRefreshToken(
    { sub: String(user.id) },
    process.env.REFRESH_TOKEN_SECRET,
    process.env.REFRESH_TOKEN_TTL
  );
  Store.addRefreshToken(user.id, refreshToken);
  res.json({ accessToken, refreshToken });
};

const refresh = (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: "Missing token" });
    const payload = verifyRefreshToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = Store.findUserById(Number(payload.sub));
    if (!user || !user.refreshTokens.includes(refreshToken))
      return res.status(401).json({ error: "Unauthorized" });
    const newAccessToken = signAccessToken(
      { sub: String(user.id), email: user.email, roles: user.roles },
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_TTL
    );
    const newRefreshToken = signRefreshToken(
      { sub: String(user.id) },
      process.env.REFRESH_TOKEN_SECRET,
      process.env.REFRESH_TOKEN_TTL
    );
    Store.revokeRefreshToken(user.id, refreshToken);
    Store.addRefreshToken(user.id, newRefreshToken);
    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
};

const logout = (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.json({ success: true });
    const payload = verifyRefreshToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = Store.findUserById(Number(payload.sub));
    if (user) Store.revokeRefreshToken(user.id, refreshToken);
    res.json({ success: true });
  } catch {
    res.json({ success: true });
  }
};

const revokeAll = (req, res) => {
  const { userId } = req.body;
  const ok = Store.revokeAll(Number(userId));
  if (!ok) return res.status(404).json({ error: "Not found" });
  res.json({ success: true });
};

export { register, login, refresh, logout, revokeAll };
