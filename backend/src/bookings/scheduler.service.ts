import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service'; // Adjust path as needed

@Injectable()
export class BookingsSchedulerService {
  private readonly logger = new Logger(BookingsSchedulerService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 0 * * *') // Runs every day at midnight
  async updateBookingStatuses() {
    this.logger.log('Starting booking status update job...');
    const today = new Date();

    try {
      // Move CONFIRMED → ACTIVE
      const confirmedToActive = await this.prisma.bookings.updateMany({
        where: {
          status: 'CONFIRMED',
          start_date: {
            lte: today,
          },
        },
        data: {
          status: 'ACTIVE',
        },
      });

      this.logger.log(`Updated ${confirmedToActive.count} bookings from CONFIRMED to ACTIVE`);

      // Move ACTIVE → COMPLETED
      const activeToCompleted = await this.prisma.bookings.updateMany({
        where: {
          status: 'ACTIVE',
          end_date: {
            lt: today,
          },
        },
        data: {
          status: 'COMPLETED',
        },
      });

      this.logger.log(`Updated ${activeToCompleted.count} bookings from ACTIVE to COMPLETED`);

      this.logger.log('Booking status update job completed successfully');
    } catch (error) {
      this.logger.log(`Error updating booking statuses`);
    }
  }
}