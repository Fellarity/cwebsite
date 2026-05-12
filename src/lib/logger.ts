import { prisma } from "./prisma";
import { LogLevel } from "@prisma/client";

export async function logEvent({
  event,
  level = "INFO",
  message,
  metadata,
  userId
}: {
  event: string;
  level?: LogLevel;
  message: string;
  metadata?: any;
  userId?: string;
}) {
  try {
    return await prisma.auditLog.create({
      data: {
        event,
        level,
        message,
        metadata: metadata || {},
        userId
      }
    });
  } catch (error) {
    console.error("Critical: Failed to save Audit Log:", error);
  }
}
