import { Request, Response } from "express";
import { z } from "zod";
import {
  generateMonthlyReport,
  generateSpendingReport,
} from "../services/report.service";

const dateSchema = z.string().transform((str) => new Date(str));

export const getMonthlyReport = async (req: Request, res: Response) => {
  const schema = z.object({
    date: dateSchema,
  });

  const { date } = schema.parse(req.query);
  const report = await generateMonthlyReport(req.user!.userId, date);

  res.json({ success: true, data: report });
};

export const getSpendingReport = async (req: Request, res: Response) => {
  const schema = z.object({
    startDate: dateSchema,
    endDate: dateSchema,
  });

  const { startDate, endDate } = schema.parse(req.query);
  const report = await generateSpendingReport(
    req.user!.userId,
    startDate,
    endDate,
  );

  res.json({ success: true, data: report });
};
