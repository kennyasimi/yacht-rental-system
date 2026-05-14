import { Controller, Request, Body, UseGuards, Post, Patch, Param, ParseIntPipe, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/createbooking.dto';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/auth/auth.enums';

@Controller('bookings')
export class BookingsController {
    constructor (private bookingsService: BookingsService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    createBooking(
        @Request() req,
        @Body() createBookingDto: CreateBookingDto
    ) {
        return this.bookingsService.createBooking(
            req.user.userId,
            createBookingDto,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/cancel')
    async cancelBooking(
        @Param('id', ParseIntPipe) bookingId: number,
        @Request() req: any,
        ) {
        const userId = req.user.id;
        return this.bookingsService.cancelBooking(bookingId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getBooking(
        @Param('id', ParseIntPipe) bookingId: number,
        @Request() req: any,
        ){
            const userId = req.user.id;
            return this.bookingsService.getBookingById(userId, bookingId)
    }

    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    getAllUsers(
        ) {
        return this.bookingsService.getAllBookings();
    }

}
