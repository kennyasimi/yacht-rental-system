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
    @Get('all')
    async getUsersBookings(@Request() req: any){
            const id = parseInt(req.user.userId);
            return this.bookingsService.getUsersBookings(id)
        }

    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('admin/all')
    getAllBookings(
        ) {
        return this.bookingsService.getAllBookings();
    }

    @UseGuards(JwtAuthGuard)
    @Post('create')
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
        const userId = req.user.userId;
        return this.bookingsService.cancelBooking(bookingId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getBooking(
        @Param('id', ParseIntPipe) bookingId: number,
        @Request() req: any,
        ){
            const userId = parseInt(req.user.userId);
            return this.bookingsService.getBookingById(userId, bookingId)
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
