import { CacheModule as NestCacheModule } from "@nestjs/cache-manager";
import KeyvRedis from "@keyv/redis";
import { CacheService } from "./cache.service";
import {
  Global,
  Module,
  type MiddlewareConsumer,
  type NestModule,
} from "@nestjs/common";
import { CacheContextMiddleware } from "@/lib/middleware/cache.middleware";

@Global()
@Module({
  imports: [
    NestCacheModule.register({
      store: new KeyvRedis("redis://localhost:6379"),
      isGlobal: true,
      ttl: 60 * 60,
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CacheContextMiddleware).forRoutes("*");
  }
}
