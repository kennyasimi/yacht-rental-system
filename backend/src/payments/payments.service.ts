import { Injectable, NotFoundException, BadRequestException} from '@nestjs/common';
import { PerformanceNodeTiming } from 'perf_hooks';
import { BookingsService, BookingStatus } from '../bookings/bookings.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
//import  Stripe   from 'stripe';



@Injectable()
export class paymentsService {
    constructor(
        private prisma: PrismaService,
        private configService: ConfigService ) {
    }

   async processPayment(
  bookingId: number,
  userId: number,
  paymentMethod: string,
) {

  const booking =
    await this.prisma.bookings.findFirst({
      where: {
        booking_id: bookingId,
        user_id: userId,
      },
    });

  if (!booking) {
    throw new NotFoundException(
      'Booking not found',
    );
  }

  if (booking.status !== 'PENDING') {
    throw new BadRequestException(
      'Only pending bookings can be paid',
    );
  }

  if (!booking.total_price) {
    throw new BadRequestException(
      'Booking total price missing',
    );
  }

  // simulation of a successful / failed payment.Probability of successful payment is 70%
  const paymentSuccessful =
    Math.random() > 0.3;

  const paymentDate = new Date();

  //  successful payment
  if (paymentSuccessful) {

    const payment =
      await this.prisma.payments.create({
        data: {
          booking_id: booking.booking_id,
          amount: booking.total_price,
          payment_status: 'SUCCESSFUL',
          payment_method: paymentMethod,
          payment_date: paymentDate.toISOString(),
        },
      });

    return {
      success: true,

      message:
        'Payment successful. Booking confirmed.',

      payment,
    };
  }

  // FAILED PAYMENT
  else {

    const failedPayment =
      await this.prisma.payments.create({
        data: {
          booking_id: booking.booking_id,

          amount: booking.total_price,

          payment_status: 'FAILED',

          payment_date: paymentDate.toISOString(),

          error_message:
            'Simulated payment failure',
        },
      });

    return {
      success: false,

      message:
        'Payment failed. Please try again.',

      payment: failedPayment,
    };
  }
}

  async getPaymentByBookingId(
    bookingId: number,
  ) {

    return this.prisma.payments.findMany({
      where: {
        booking_id: bookingId,
      },

      orderBy: {
        payment_date: 'desc',
      },
    });
  }

  async getAllPayments() {

    return this.prisma.payments.findMany({
      include: {
        bookings: {
          select: {
            booking_id: true,
            user_id: true,
            start_date: true,
            end_date: true,
            status: true,
          },
        },
      },

      orderBy: {
        payment_date: 'desc',
      },
    });
  }
}
