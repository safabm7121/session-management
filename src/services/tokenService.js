import jwt from "jsonwebtoken";

export const signAccessToken = (payload, secret, ttl) =>
  jwt.sign(payload, secret, { expiresIn: ttl });

export const signRefreshToken = (payload, secret, ttl) =>
  jwt.sign(payload, secret, { expiresIn: ttl });

export const verifyAccessToken = (token, secret) => jwt.verify(token, secret);

export const verifyRefreshToken = (token, secret) => jwt.verify(token, secret);
