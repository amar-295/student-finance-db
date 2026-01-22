import express from "express";
import { asyncHandler, authenticate } from "../middleware";
import {
  getMonthlyReport,
  getSpendingReport,
} from "../controllers/report.controller";

const router = express.Router();

router.use(authenticate);

router.get("/monthly", asyncHandler(getMonthlyReport));
router.get("/spending", asyncHandler(getSpendingReport));

export default router;
