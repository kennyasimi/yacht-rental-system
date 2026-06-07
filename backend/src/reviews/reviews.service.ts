import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createReviewDto } from './dto/review.dto';
import { BookingStatus } from '../bookings/bookings.service';
import { error } from 'console';
import { updateReviewDto } from './dto/updatereview.dto';

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
            
        });
        if (!booking) {
            throw new BadRequestException ('Booking is incomplete');
        }
        const existingReview = await this.prisma.reviews.findFirst({
            where: {
            booking_id: booking_ID,
            },
        });

        if(existingReview) {
            throw new ConflictException('You have already reviewed this booking')
        }

        return this.prisma.reviews.create({
            data: {booking_id: booking_ID,
                rating: dto.rating,
                comment:dto.comment,
                boat_id: booking.boat_id,
                user_id: userId

            }
        })
    }

    async updateReview(reviewId: number, userId: number, dto: updateReviewDto) {
        // Check if review exists and belongs to user
        const review = await this.prisma.reviews.findFirst({
            where: {
                review_id: reviewId,
                user_id: userId,
            },
        });

        if (!review) {
            throw new NotFoundException('Review not found or you do not have permission');
        }

        // Update the review
        return this.prisma.reviews.update({
            where: {
                review_id: reviewId,
            },
            data: {
                rating: dto.rating,
                comment: dto.comment,
                updated_at: new Date(),
            },
        });
    }

    async getUserReviews(userId: number) {
        return this.prisma.reviews.findMany({
            where: {
                user_id: userId,
            },
            include: {
                bookings: {
                    include: {
                        boats: true,
                    },
                },
            },
            orderBy: {
                created_at: 'desc',
            },
        });
    }



    async deleteReview(reviewId: number, userId: number) {
        // Check if review exists and belongs to user
        const review = await this.prisma.reviews.findFirst({
            where: {
                review_id: reviewId,
                user_id: userId,
            },
        });

        if (!review) {
            throw new NotFoundException('Review not found or you do not have permission');
        }

        // Delete the review
        await this.prisma.reviews.delete({
            where: {
                review_id: reviewId,
            },
        });

        return { message: 'Review deleted successfully' };
    }


    async getBoatAverageRating(boatId: number): Promise<{ averageRating: number | null; totalReviews: number }> {
        const result = await this.prisma.reviews.aggregate({
            where: {
                boat_id: boatId,
            },
            _avg: {
                rating: true,
            },
            _count: {
                rating: true,
            },
        });

        return {
            averageRating: result._avg.rating ? parseFloat(result._avg.rating.toFixed(1)) : null,
            totalReviews: result._count.rating,
        };
    }

    async getBoatReviews(boatId: number, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        
        const [reviews, total] = await Promise.all([
            this.prisma.reviews.findMany({
                where: {
                    boat_id: boatId,
                },
                include: {
                    bookings: {
                        include: {
                            users: {
                                select: {
                                    first_name: true,
                                    last_name: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    created_at: 'desc',
                },
                skip,
                take: limit,
            }),
            this.prisma.reviews.count({
                where: {
                    boat_id: boatId,
                },
            }),
        ]);

        // Format the reviews for frontend
        const formattedReviews = reviews.map(review => ({
            review_id: review.review_id,
            rating: review.rating,
            comment: review.comment,
            created_at: review.created_at,
            user_name: `${review.bookings?.users.first_name} ${review.bookings?.users.last_name}`,
        }));

        return {
            reviews: formattedReviews,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    
    async getMultipleBoatsAverageRating(boatIds: number[]): Promise<Map<number, { averageRating: number | null; totalReviews: number }>> {
        const results = await this.prisma.reviews.groupBy({
            by: ['boat_id'],
            where: {
                boat_id: {
                    in: boatIds,
                },
            },
            _avg: {
                rating: true,
            },
            _count: {
                rating: true,
            },
        });

        const ratingMap = new Map();
        results.forEach((result) => {
            ratingMap.set(result.boat_id, {
                averageRating: result._avg.rating ? parseFloat(result._avg.rating.toFixed(1)) : null,
                totalReviews: result._count.rating,
            });
        });
        return ratingMap;
    }

    async getUserReviewForBooking(bookingId: number, userId: number) {
        const review = await this.prisma.reviews.findFirst({
            where: {
                booking_id: bookingId,
                user_id: userId,
            },
        });

        return review;
    }
}