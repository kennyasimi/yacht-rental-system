import { Controller, UseGuards, Body, Get, Post, Request,Param, ParseIntPipe } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaymentDto } from './dto/payments.dto';
import { paymentsService } from './payments.service';
import { UserRole } from '../auth/auth.enums';
import { RolesGuard } from '../auth/roles.guard';
@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: paymentsService){}

    @UseGuards(JwtAuthGuard)
    @Post('me/pay')
    payForBooking(
        @Request() req,
        @Body() dto: PaymentDto,
    ) {
    return this.paymentsService.processPayment(
        dto.booking_id,
        req.user.userId,
        dto.payment_method,
    )}

    @UseGuards(JwtAuthGuard)
    @Get('me/booking/:bookingId')
    getMyBookingPayments(
      @Request() req,
      @Param('bookingId', ParseIntPipe)
      bookingId: number,
    ) {

      return this.paymentsService.getPaymentByBookingId(
        bookingId,
      );
    }

    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    getAllPayments() {

    return this.paymentsService.getAllPayments();
    }
}


