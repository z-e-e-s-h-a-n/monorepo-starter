import { Injectable } from "@nestjs/common";
import { PrismaService } from "@modules/prisma/prisma.service";
import { AuthService } from "@modules/auth/auth.service";
import { SignUpDto } from "@workspace/contracts/auth";
import type { Prisma } from "@generated/prisma";

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService
  ) {}

  async createCustomer(dto: SignUpDto) {
    const { user } = await this.authService.createUser(dto, "customer");

    return {
      message: "Customer created successfully",
      data: { user },
    };
  }

  async findAllUsers(query: UserQueryType) {
    const {
      page,
      limit,
      sortBy,
      sortDir,
      search,
      searchBy,
      role,
      deleted,
      isEmailVerified,
      isPhoneVerified,
    } = query;

    const where: Prisma.UserWhereInput = {};

    // Filters
    if (deleted === true) where.deletedAt = { not: null };

    if (role) where.roles = { some: { role } };
    console.log("role *******", role);

    if (isEmailVerified !== undefined) where.isEmailVerified = isEmailVerified;
    if (isPhoneVerified !== undefined) where.isPhoneVerified = isPhoneVerified;

    // Search mapping
    const searchWhereMap: Record<
      UserSearchByType,
      (value: string) => Prisma.UserWhereInput
    > = {
      id: (v) => ({ id: v }),
      email: (v) => ({
        email: { contains: v, mode: "insensitive" },
      }),
      phone: (v) => ({
        phone: { contains: v, mode: "insensitive" },
      }),
      displayName: (v) => ({
        displayName: { contains: v, mode: "insensitive" },
      }),
    };

    if (search && searchBy) {
      Object.assign(where, searchWhereMap[searchBy](search));
    }

    const skip = (page - 1) * limit;
    const orderBy = { [sortBy]: sortDir };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: this.authService.userSelect,
      }),
      this.prisma.user.count({ where }),
    ]);

    const normalizedUsers = users.map((user) => ({
      ...user,
      roles: user.roles.map((r) => r.role),
    }));

    return {
      message: "Users fetched successfully.",
      data: {
        users: normalizedUsers,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
