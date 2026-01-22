import { Router } from "express";
import * as groupController from "../controllers/group.controller";
import { authenticate, asyncHandler } from "../middleware";

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get("/", asyncHandler(groupController.getAll));
router.get("/:id", asyncHandler(groupController.getById));
router.post("/", asyncHandler(groupController.create));
router.put("/:id", asyncHandler(groupController.update));
router.post("/:id/members", asyncHandler(groupController.addMember));
router.delete(
  "/:id/members/:memberId",
  asyncHandler(groupController.removeMember),
);

export default router;
