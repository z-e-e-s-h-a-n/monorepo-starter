import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EnvModule } from "@/modules/env/env.module";
import { validateEnv } from "@/schemas/env.schema";
import { PublicModule } from "@/modules/public/public.module";
import { LoggerModule } from "@/modules/logger/logger.module";
import { AllExceptionsFilter } from "@/common/filters/exceptions.filter";
import { ResponseInterceptor } from "@/common/interceptors/response.interceptor";
import { PrismaModule } from "./modules/prisma/prisma.module";

@Module({
  imports: [
    PublicModule,
    LoggerModule,
    EnvModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
  ],

  providers: [AllExceptionsFilter, ResponseInterceptor],
})
export class AppModule {}
