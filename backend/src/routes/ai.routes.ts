import express from "express";
import { authenticate, asyncHandler } from "../middleware";
import {
  getInsights,
  getSubscriptions,
  getRecommendationsHandler,
  getPatterns,
} from "../controllers/ai.controller";

const router = express.Router();

router.use(authenticate);

router.get("/insights", asyncHandler(getInsights));
router.get("/subscriptions", asyncHandler(getSubscriptions));
router.get("/recommendations", asyncHandler(getRecommendationsHandler));
router.get("/patterns", asyncHandler(getPatterns));

export default router;
