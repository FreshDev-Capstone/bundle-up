import { Router } from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/authControllers';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// Local authentication routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  AuthController.googleCallback
);

// Protected routes (require JWT)
router.get('/profile', authenticateJWT, AuthController.getProfile);
router.put('/profile', authenticateJWT, AuthController.updateProfile);

export default router; 