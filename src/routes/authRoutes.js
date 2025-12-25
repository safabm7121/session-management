import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
  revokeAll,
} from "../controllers/authController.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.post("/refresh", refresh);

router.post("/logout", logout);

router.post("/revoke-all", revokeAll);

export default router;
