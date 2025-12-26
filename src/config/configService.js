import "dotenv/config";

export const Config = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || "change-me",
  accessExp: process.env.ACCESS_TOKEN_EXP || "15m",
  refreshExp: process.env.REFRESH_TOKEN_EXP || "7d",
};
