import { Request, Response } from "express";
import * as client from "prom-client";
import prisma from "../config/database";
import config from "../config/env";

// Enable default metrics collection
const register = new client.Registry();
client.collectDefaultMetrics({ register });

/**
 * Basic health check
 * GET /health
 */
export const healthCheck = async (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Backend is up and running",
    track_metrics: "/health/metrics",
    timestamp: new Date().toISOString(),
  });
};

/**
 * Prometheus metrics endpoint
 * GET /health/metrics
 */
export const getMetrics = async (_req: Request, res: Response) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
};

/**
 * Detailed health check included database connection status
 */
export const detailedHealthCheck = async (_req: Request, res: Response) => {
  const checks = {
    server: "ok",
    database: "unknown",
    timestamp: new Date().toISOString(),
    environment: config.env,
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      unit: "MB",
    },
  };

  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "ok";
  } catch (error) {
    checks.database = "error";
  }

  const isHealthy = checks.server === "ok" && checks.database === "ok";

  res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    data: checks,
  });
};
