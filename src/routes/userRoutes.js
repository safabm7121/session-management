import { Router } from "express";
import {
  list,
  get,
  create,
  update,
  changePassword,
  remove,
} from "../controllers/userController.js";

const router = Router();

router.get("/", list);
router.get("/:id", get);
router.post("/", create);
router.put("/:id", update);
router.put("/:id/password", changePassword);
router.delete("/:id", remove);

export default router;
