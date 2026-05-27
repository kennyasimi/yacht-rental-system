import { Controller, Request, Body, UseGuards, Post, Patch, Param, ParseIntPipe, Get,  Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/createbooking.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../auth/auth.enums';

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

    @UseGuards(JwtAuthGuard)
    @Get('/all')
    getUsersBookings(
        @Param('id', ParseIntPipe)
        @Request() req: any,
        ){
            const userId = req.user.id;
            return this.bookingsService.getUsersBookings(userId)
    }

    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    getAllBookings(
        ) {
        return this.bookingsService.getAllBookings();
    }

     @Get('boat/:boatId/availability')
    async getBoatAvailability(
        @Param('boatId', ParseIntPipe) boatId: number,
        @Query('month') month?: number,
        @Query('year') year?: number,
    ) {
        return this.bookingsService.getBoatAvailability(boatId, month, year);
    }

}
