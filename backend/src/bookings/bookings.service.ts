import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/createbooking.dto';

export enum BookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED'
}

@Injectable()
export class BookingsService {
    constructor (
        private prisma: PrismaService
        
    ){}

    async getBookingById(userId: number, bookingId: number) {
        const booking = await this.prisma.bookings.findUnique({
        where: { booking_id: bookingId,
                user_id: userId
         }

        });
        if (!booking){
            throw new NotFoundException ('Booking ${bookingId} not found')
        }

        return this.prisma.bookings.findUnique({
            where: {
                booking_id: bookingId,
                user_id: userId,
            }
        })
    }

    async getAllBookings(){
        return this.prisma.bookings.findMany()
    }

    async createBooking(userId: number, dto: CreateBookingDto) {
        const{ boat_id, start_date, end_date } = dto;
        if(start_date >= end_date){
            throw new BadRequestException('The start date must be earlier than the end date');
        }

        const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (new Date(start_date) < today) {
                throw new BadRequestException('Cannot book a boat for a past date');
            }

        const conflictingBooking = await this.prisma.bookings.findFirst({
            where: {
                boat_id: boat_id,
                // The core mathematical overlap condition:
                start_date: { lt: end_date },   // Existing Start < Requested End
                end_date: { gt: start_date },   // Existing End > Requested Start
                status: { not: 'CANCELLED' } 
                // Optional safety: Ignore canceled bookings if your table tracks status
                // status: { not: 'CANCELED' } 
                },
            });
        if (conflictingBooking) {
            throw new ConflictException('Boat already booked for selected time slot')
        }   
        return this.prisma.bookings.create({
            data: {
            user_id: userId,
            boat_id: dto.boat_id,
            start_date: new Date(dto.start_date),
            end_date: new Date(dto.end_date),
            status: BookingStatus.PENDING,
            created_at: new Date(),
            },
        });
    }

    async cancelBooking(bookingId: number, userId: number) {
    // 1. Fetch the booking to verify ownership and current status
    const booking = await this.prisma.bookings.findUnique({
      where: { booking_id: bookingId },
    });
    const today = new Date();
    if (new Date(booking!.start_date!) <= today) {
        throw new BadRequestException('Cannot cancel a booking that has already started');
    }
    // Security: If booking doesn't exist or doesn't belong to the user, throw 404
    if (!booking || booking.user_id !== userId) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }

    // 2. Prevent canceling an already canceled booking
    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('This booking has already been canceled.');
    }

    // 3. Perform the update
    const updatedBooking = await this.prisma.bookings.update({
      where: { booking_id: bookingId },
      data: {
        status: BookingStatus.CANCELLED,
      },
    });

    return {
      message: 'Booking successfully canceled.',
      booking: updatedBooking,
    };
  }
}
