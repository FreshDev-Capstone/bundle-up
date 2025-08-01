import express from "express";
import passport from "passport";
import { AuthController } from "../controllers/authControllers";
import { checkAuthentication } from "../middleware/auth";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  AuthController.googleAuth
);

// Mobile Google OAuth route
router.post("/google", AuthController.googleAuth);
router.get("/profile", checkAuthentication, AuthController.getProfile);
router.put("/profile", checkAuthentication, AuthController.updateProfile);
router.post("/refresh", AuthController.refreshToken);

router.post("/logout", checkAuthentication, (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

export default router;
