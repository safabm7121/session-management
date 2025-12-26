import jwt from "jsonwebtoken";
import { Config } from "../config/configService.js";

export const JwtService = {
  signAccess(payload) {
    return jwt.sign(payload, Config.jwtSecret, { expiresIn: Config.accessExp });
  },
  signRefresh(payload) {
    return jwt.sign(payload, Config.jwtSecret, {
      expiresIn: Config.refreshExp,
    });
  },
  verify(token) {
    try {
      return jwt.verify(token, Config.jwtSecret);
    } catch {
      return null;
    }
  },
};
