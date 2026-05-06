import { Router } from "express";
import { getUsers, signIn, signUp } from "../controllers/authController.js";

const router = Router();

router.get("/users", getUsers);
router.post("/signin", signIn);
router.post("/signup", signUp);

export default router;
