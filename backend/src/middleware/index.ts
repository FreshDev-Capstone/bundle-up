// Authentication middleware (consolidated)
export { 
  authenticateJWT, 
  checkAuthentication,
  requireAdmin, 
  requireB2B, 
  requireB2BOrAdmin, 
  optionalAuth 
} from './auth';

// Logging middleware (consolidated)
export { 
  logRoutes, 
  logErrors, 
  logDatabaseErrors, 
  logAuthErrors 
} from './logging'; 