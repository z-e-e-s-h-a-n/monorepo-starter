import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_PIPE } from "@nestjs/core";
import { EnvModule } from "@modules/env/env.module";
import { validateEnv } from "@schemas/env.schema";
import { AuthGuard } from "@guards/auth.guard";
import { AuthModule } from "@modules/auth/auth.module";
import { TokenModule } from "@modules/token/token.module";
import { PublicModule } from "@modules/public/public.module";
import { PrismaModule } from "@modules/prisma/prisma.module";
import { LoggerModule } from "@modules/logger/logger.module";
import { SchedulerModule } from "@modules/scheduler/scheduler.module";
import { NotificationModule } from "@modules/notification/notification.module";
import { TemplateModule } from "@modules/template/template.module";
import { AllExceptionsFilter } from "@filters/exceptions.filter";
import { ResponseInterceptor } from "@/lib/interceptors/response.interceptor";
import { ZodValidationPipe } from "nestjs-zod";
import { CacheModule } from "@modules/cache/cache.module";
import { AdminModule } from "./modules/admin/admin.module";

@Module({
  imports: [
    PublicModule,
    AdminModule,
    PrismaModule,
    LoggerModule,
    EnvModule,
    AuthModule,
    TokenModule,
    TemplateModule,
    NotificationModule,
    CacheModule,
    SchedulerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    AllExceptionsFilter,
    ResponseInterceptor,
  ],
})
export class AppModule {}
