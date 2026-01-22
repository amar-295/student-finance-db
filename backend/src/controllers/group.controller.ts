import { Request, Response } from "express";
import * as groupService from "../services/group.service";

/**
 * Get all groups for a user
 */
export const getAll = async (req: Request, res: Response) => {
  const groups = await groupService.getUserGroups(req.user!.userId);
  res.json({
    success: true,
    data: groups,
  });
};

/**
 * Get a single group by ID
 */
export const getById = async (req: Request, res: Response) => {
  const group = await groupService.getGroupById(
    req.user!.userId,
    req.params.id as string,
  );
  return res.json({
    success: true,
    data: group,
  });
};

/**
 * Create a new group
 */
export const create = async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Group name is required" });
  }
  const group = await groupService.createGroup(req.user!.userId, name);
  return res.status(201).json({
    success: true,
    data: group,
  });
};

/**
 * Update a group name
 */
export const update = async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Group name is required" });
  }
  const group = await groupService.updateGroup(
    req.user!.userId,
    req.params.id as string,
    name,
  );
  return res.json({
    success: true,
    data: group,
  });
};

/**
 * Add a member to a group
 */
export const addMember = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Member email is required" });
  }
  const member = await groupService.addMemberToGroup(
    req.user!.userId,
    req.params.id as string,
    email,
  );
  return res.status(201).json({
    success: true,
    data: member,
  });
};

/**
 * Remove a member from a group
 */
export const removeMember = async (req: Request, res: Response) => {
  const { memberId } = req.params;
  await groupService.removeMemberFromGroup(
    req.user!.userId,
    req.params.id as string,
    memberId as string,
  );
  return res.json({
    success: true,
    message: "Member removed successfully",
  });
};
