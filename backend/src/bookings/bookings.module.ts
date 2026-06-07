import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { BookingsSchedulerService } from './scheduler.service';

@Module({
  providers: [BookingsService, BookingsSchedulerService],
  controllers: [BookingsController],
  exports: [BookingsService]
})
export class BookingsModule {}
