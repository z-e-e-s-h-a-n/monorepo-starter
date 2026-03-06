import type { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

import { softDeleteExtension } from "./prisma.extension";
import { InjectLogger } from "@/decorators/logger.decorator";
import { EnvService } from "@/modules/env/env.service";
import { LoggerService } from "@/modules/logger/logger.service";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  @InjectLogger()
  private readonly logger!: LoggerService;

  constructor(env: EnvService) {
    const adapter = new PrismaPg({
      connectionString: env.get("DB_URI"),
    });

    super({ adapter });

    Object.assign(this, this.$extends(softDeleteExtension));
  }

  async onModuleInit() {
    this.logger.log("Connecting to the database...");
    try {
      await this.$connect();
      this.logger.log("✅ Database connection established.");
    } catch (error) {
      this.logger.error("❌ Database connection failed", { error });
      throw error;
    }
  }

  async onModuleDestroy() {
    this.logger.log("Disconnecting from the database...");
    try {
      await this.$disconnect();
      this.logger.log("Database connection closed.");
    } catch (error) {
      this.logger.error("❌ Error disconnecting database", { error });
      throw error;
    }
  }
}
