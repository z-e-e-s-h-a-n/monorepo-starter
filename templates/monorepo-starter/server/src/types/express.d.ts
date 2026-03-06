import type { UserStatus, UserRole } from "@generated/prisma";

declare global {
  namespace Express {
    interface User {
      id: string;
      role: UserRole;
      status: UserStatus;
      sessionId?: string;
    }
  }
}

export {};
