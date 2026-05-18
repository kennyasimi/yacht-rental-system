import { Injectable, NotFoundException, BadRequestException} from '@nestjs/common';
import { PerformanceNodeTiming } from 'perf_hooks';
import { BookingsService, BookingStatus } from '../bookings/bookings.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import  Stripe   from 'stripe';



@Injectable()
export class paymentsService {
    private stripe: InstanceType<typeof Stripe>;


    constructor(
        private prisma: PrismaService,
        private configService: ConfigService ) {
          const apiKey = this.configService.get('STRIPE_SECRET_KEY');

        this.stripe = new Stripe(apiKey,{
            apiVersion: '2026-04-22.dahlia',
        });
    }

    async processPayment(
    bookingId: number,
    userId: number,
    paymentMethod: string,) {

    // 1. Verify booking exists and belongs to user
    const booking = await this.prisma.bookings.findFirst({
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

    // 2. Only pending bookings can be paid
    if (booking.status !== 'PENDING') {
      throw new BadRequestException(
        'Only pending bookings can be paid',
      );
    }

    // 3. Ensure booking has total price
    if (!booking.total_price) {
      throw new BadRequestException(
        'Booking total price missing',
      );
    }

    try {

      // 4. Process payment through Stripe
      const paymentIntent =
        await this.stripe.paymentIntents.create({
          amount: Math.round(
            Number(booking.total_price) * 100,
          ),

          currency: 'usd',

          payment_method: paymentMethod,

          confirm: true,

          automatic_payment_methods: {
            enabled: true,
            allow_redirects: 'never',
          },
        });
    const exactPaymentDate = new Date(paymentIntent.created * 1000);
        
      // SUCCESSFUL PAYMENT
      if (paymentIntent.status === 'succeeded') {

        const payment =
          await this.prisma.payments.create({
            data: {
              booking_id: booking.booking_id,

              amount: booking.total_price,

              payment_status: 'SUCCESSFUL',

              //transaction_id: paymentIntent.id,

              payment_date: exactPaymentDate.toISOString(),

              //stripe_payment_intent_id:
                //paymentIntent.id,
            },
          });

        
          //IMPORTANT:PostgreSQL trigger now automatically: PENDING -> CONFIRMED
        

        return {
          success: true,

          message:
            'Payment successful. Booking confirmed.',

          payment,
        };
      }

      // 6. FAILED / INCOMPLETE PAYMENT
      else {

        const failedPayment =
          await this.prisma.payments.create({
            data: {
              booking_id: booking.booking_id,

              amount: booking.total_price,

              payment_status: 'FAILED',

              //transaction_id: paymentIntent.id,

              payment_date: exactPaymentDate.toISOString(),

            },
          });

        return {
          success: false,

          message:
            `Payment failed with status: ${paymentIntent.status}`,

          payment: failedPayment,
        };
      }

    } catch (error) {

      // Stripe/network/runtime errors

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Payment processing failed';

      const failedPayment =
        await this.prisma.payments.create({
          data: {
            booking_id: booking.booking_id,

            amount: booking.total_price,

            payment_status: 'FAILED',

            transaction_id: null,

            error_message: errorMessage,
          },
        });

      return {
        success: false,

        message: errorMessage,

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
