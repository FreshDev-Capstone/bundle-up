import express from "express";
import passport from "passport";
import { AuthController } from "../controllers/authControllers";
import { checkAuthentication } from "../middleware/auth";

const router = express.Router();

router.post("/", AuthController.login);

router.delete(
  "/",
  checkAuthentication,
  (req: express.Request, res: express.Response) => {
    // In a stateless JWT system, logout is handled client-side
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  }
);

router.post("/refresh", (req, res) => {
  // TODO: Implement token refresh logic
  res.status(501).json({
    success: false,
    error: "Token refresh not implemented yet",
  });
});

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

export default router;
