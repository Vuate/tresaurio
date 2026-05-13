import { prisma } from "@/lib/db";

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_ATTEMPTS = 3;

export async function checkSignupRateLimit(ip: string): Promise<{ success: boolean; remaining: number }> {
  const windowStart = new Date(Date.now() - WINDOW_MS);

  const count = await prisma.signupAttempt.count({
    where: {
      ip,
      createdAt: { gte: windowStart },
    },
  });

  if (count >= MAX_ATTEMPTS) {
    return { success: false, remaining: 0 };
  }

  await prisma.signupAttempt.create({ data: { ip } });
  return { success: true, remaining: MAX_ATTEMPTS - count - 1 };
}
