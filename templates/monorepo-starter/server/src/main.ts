import { NestFactory } from "@nestjs/core";
import { AppModule } from "@/app.module";
import cookieParser from "cookie-parser";
import { AllExceptionsFilter } from "@filters/exceptions.filter";
import { ResponseInterceptor } from "@/lib/interceptors/response.interceptor";
import { EnvService } from "@modules/env/env.service";
import { LoggerService } from "@modules/logger/logger.service";
import { WinstonModule } from "nest-winston";
import { winstonConfig } from "@modules/logger/winston.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });
  const env = app.get(EnvService);
  const logger = await app.resolve(LoggerService);

  const start = Date.now();
  const port = env.get("APP_PORT");
  const endpoint = env.get("APP_ENDPOINT");
  const nodeEnv = env.get("NODE_ENV");
  const allowedOrigins = env.get("CORS_ORIGIN");

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-client-url"],
  });
  app.use(cookieParser());
  app.useGlobalInterceptors(app.get(ResponseInterceptor));
  app.useGlobalFilters(app.get(AllExceptionsFilter));
  await app.listen(port);

  logger.log("==========================================");
  logger.log(`🚀 Server started successfully!`);
  logger.log(`🌐 Endpoint: ${endpoint}`);
  logger.log(`🔒 Environment: ${nodeEnv}`);
  logger.log(`📦 Listening on port: ${port}`);
  logger.log(`⏱️ Startup time: ${Date.now() - start}ms`);
  logger.log(
    `🪵 Logger initialized with Winston (see logs directory if enabled)`
  );
  logger.log("==========================================");
}
bootstrap();
