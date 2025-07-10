import express from "express";
import { AuthController } from "../controllers/authControllers";
import { checkAuthentication } from "../middleware/auth";

const router = express.Router();

router.post("/", AuthController.register);
router.get("/me", checkAuthentication, AuthController.getProfile);
router.put("/me", checkAuthentication, AuthController.updateProfile);
router.put("/me/password", checkAuthentication, AuthController.changePassword);

export default router;
