import express from "express";
import { asyncHandler, authenticate } from "../middleware";
import { getAll, getOne, create } from "../controllers/category.controller";

const router = express.Router();

// Public routes (if any, but usually auth required for user categories)
router.use(authenticate);

/**
 * @route   GET /api/categories
 * @desc    Get all categories (system + user)
 * @access  Private
 */
router.get("/", asyncHandler(getAll));

/**
 * @route   POST /api/categories
 * @desc    Create custom category
 * @access  Private
 */
router.post("/", asyncHandler(create));

/**
 * @route   GET /api/categories/:id
 * @desc    Get category details
 * @access  Private
 */
router.get("/:id", asyncHandler(getOne));

export default router;
