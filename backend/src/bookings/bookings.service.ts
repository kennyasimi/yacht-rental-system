import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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

    async getUsersBookings(userId: number) {
        const bookings = await this.prisma.bookings.findMany({
            where: {
                users: {
                    user_id: userId
                }
            },
                include: {
                    boats: {
                        select: {
                            boat_id: true,
                            boat_name: true,
                            boat_type: true,
                            price_per_day: true,
                        }
                    }
                 }
            });
        console.log('Found bookings:', bookings.length);
        return bookings;  
    }

    async getAllBookings(){
        return this.prisma.bookings.findMany()
    }

    async createBooking(userId: number, dto: CreateBookingDto) {
        const{ boat_id, start_date, end_date } = dto;
        if(new Date(start_date) >= new Date(end_date)){
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
        
        const bookingDate = new Date()
        //create a current date variable
        return this.prisma.bookings.create({
            data: {
            user_id: userId,
            boat_id: dto.boat_id,
            start_date: new Date(dto.start_date).toISOString(),
            end_date: new Date(dto.end_date).toISOString(),
            status: BookingStatus.PENDING,
            created_at: bookingDate.toISOString() ,
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

  async getBoatAvailability(boatId: number, month?: number, year?: number) {
    // Default to current month if not specified
    const currentDate = new Date();
    const targetMonth = month ?? currentDate.getMonth() + 1;
    const targetYear = year ?? currentDate.getFullYear();
    
    // Get start and end of the month
    const startOfMonth = new Date(targetYear, targetMonth - 1, 1);
    const endOfMonth = new Date(targetYear, targetMonth, 0);
    
    // Get all bookings for this boat in the month
    const bookings = await this.prisma.bookings.findMany({
        where: {
            boat_id: boatId,
            status: { not: 'CANCELLED' },
            OR: [
                {
                    start_date: { lte: endOfMonth },
                    end_date: { gte: startOfMonth }
                }
            ]
        }
    });
    
    // Generate array of booked dates
    const bookedDates: string[] = [];
    
    bookings.forEach(booking => {
        const start = new Date(booking.start_date!);
        const end = new Date(booking.end_date!);
        
        // Adjust to month boundaries
        const loopStart = start < startOfMonth ? startOfMonth : start;
        const loopEnd = end > endOfMonth ? endOfMonth : end;
        
        for (let d = new Date(loopStart); d <= loopEnd; d.setDate(d.getDate() + 1)) {
            bookedDates.push(d.toISOString().split('T')[0]);
        }
    });
    
    // Get unique dates
    const uniqueBookedDates = [...new Set(bookedDates)];
    
    return {
        boatId,
        year: targetYear,
        month: targetMonth,
        bookedDates: uniqueBookedDates,
        availableDates: this.getAvailableDates(targetYear, targetMonth, uniqueBookedDates)
    };
}

private getAvailableDates(year: number, month: number, bookedDates: string[]): string[] {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const availableDates: string[] = [];
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateString = d.toISOString().split('T')[0];
        if (!bookedDates.includes(dateString)) {
            availableDates.push(dateString);
        }
    }
    
    return availableDates;
}
}
