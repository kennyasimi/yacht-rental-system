import { Module } from '@nestjs/common';
import { paymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { BookingsService } from 'src/bookings/bookings.service';
import { BookingsModule } from 'src/bookings/bookings.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [BookingsModule, ConfigModule],
  providers: [paymentsService],
  controllers: [PaymentsController]
})
export class PaymentsModule {}
