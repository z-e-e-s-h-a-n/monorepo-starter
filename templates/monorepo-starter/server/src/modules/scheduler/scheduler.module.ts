import { Module } from "@nestjs/common";
import { CleanupService } from "./cleanup.service";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [CleanupService],
})
export class SchedulerModule {}
