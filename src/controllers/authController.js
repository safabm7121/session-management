import { JwtService } from "../auth/jwtService.js";
import { UserService } from "../realm/userService.js";

const DEFAULT_REALM = "default";

export async function register(req, res) {
  try {
    const user = UserService.create(DEFAULT_REALM, req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(err.status || 400).json({ error: err.message });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = UserService.validate(DEFAULT_REALM, email, password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const accessToken = JwtService.signAccess({
    sub: user.id,
    realm: DEFAULT_REALM,
    roles: user.roles,
    email: user.email,
  });
  const refreshToken = JwtService.signRefresh({
    sub: user.id,
    realm: DEFAULT_REALM,
  });

  UserService.addRefreshToken(DEFAULT_REALM, user.id, refreshToken);

  res.json({ accessToken, refreshToken });
}

export async function refresh(req, res) {
  const { refreshToken } = req.body;
  const payload = JwtService.verify(refreshToken);
  if (!payload) return res.status(403).json({ error: "Invalid refresh token" });

  const accessToken = JwtService.signAccess({
    sub: payload.sub,
    realm: payload.realm,
  });
  res.json({ accessToken });
}

export async function logout(req, res) {
  const { refreshToken } = req.body;
  const payload = JwtService.verify(refreshToken);
  if (!payload) return res.status(403).json({ error: "Invalid refresh token" });

  UserService.revokeRefreshToken(payload.realm, payload.sub, refreshToken);
  res.json({ success: true });
}
