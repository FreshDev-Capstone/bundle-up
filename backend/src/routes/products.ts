import express from "express";
import { ProductController } from "../controllers/productControllers";
import { checkAuthentication } from "../middleware/auth";

const router = express.Router();

// Public routes (no authentication required)
router.get("/", ProductController.getAllProducts);
router.get("/:id", ProductController.getProductById);

// Admin routes (authentication required)
router.post("/", checkAuthentication, ProductController.createProduct);
router.put("/:id", checkAuthentication, ProductController.updateProduct);
router.delete("/:id", checkAuthentication, ProductController.deleteProduct);

export default router;
