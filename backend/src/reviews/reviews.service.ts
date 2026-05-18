import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createReviewDto } from './dto/reviw.dto';
import { BookingStatus } from '../bookings/bookings.service';
import { error } from 'console';

@Injectable()
export class reviewsService {
    constructor(private prisma: PrismaService) {}

    async createReview(booking_ID: number, dto: createReviewDto, userId: number) {
        //const today = new Date()
        const booking = await this.prisma.bookings.findUnique({
            where: { booking_id: booking_ID,
                     user_id: userId,
                     status: BookingStatus.COMPLETED
            }
            
        })
        if (!booking) {
            throw new BadRequestException ('Booking is incomplete');
        }
        const existingReview = await this.prisma.reviews.findFirst({
                where: {
                booking_id: dto.booking_id,
                },
                
            });

        if(existingReview) {
             throw new error ('Booking does not exist')
        }


        
        return this.prisma.reviews.create({
            data: {booking_id: booking_ID,
                rating: dto.rating,
                comment:dto.comment,
                boat_id: booking.boat_id,


            }
        })


    }
}
