import { PrismaClient } from "@prisma/client";

// Avoid multiple Prisma Client instances in serverless environments
let prismaClient;

if (process.env.NODE_ENV === "production") {
  prismaClient = new PrismaClient();
} else {
  // In development or serverless environments, use a global instance of PrismaClient
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prismaClient = global.prisma;
}

export const db = prismaClient;
