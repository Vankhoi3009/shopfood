import express from "express";
import { getAllUsers } from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/users", authMiddleware, roleMiddleware("admin"), getAllUsers);

export default router;
