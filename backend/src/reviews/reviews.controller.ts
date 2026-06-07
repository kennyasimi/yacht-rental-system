import { Controller, Request, Param, Body, Post, UseGuards, ParseIntPipe, Get, Query, Patch, Put, Delete } from '@nestjs/common';
import { reviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthController } from '../auth/auth.controller';
import { AuthGuard } from '@nestjs/passport';
import { createReviewDto } from './dto/review.dto';
import { dot } from 'node:test/reporters';
import { create } from 'domain';
import { updateReviewDto } from './dto/updatereview.dto';

@Controller('reviews')
export class ReviewsController {
    constructor (private reviewService: reviewsService) {}

    @UseGuards(JwtAuthGuard)
    @Post('review/:bookingId')
    createReview(
            @Param('bookingId', ParseIntPipe) bookingId: number,
            @Request() req,
            @Body() dto: createReviewDto
        ){
        return this.reviewService.createReview(
            req.user.userId,
            dto,
            bookingId

        )
    }

    @UseGuards(JwtAuthGuard)
    @Put(':reviewId')
    async updateReview(
        @Param('reviewId', ParseIntPipe) reviewId: number,
        @Body() dto: updateReviewDto,
        @Request() req,
    ) {
        return this.reviewService.updateReview(reviewId, req.user.userId, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('my-reviews')
    async getUserReviews(@Request() req) {
        return this.reviewService.getUserReviews(req.user.userId);
    }

    
    @UseGuards(JwtAuthGuard)
    @Get('booking/:bookingId')
    async getUserReviewForBooking(
        @Param('bookingId', ParseIntPipe) bookingId: number,
        @Request() req,
    ) {
        return this.reviewService.getUserReviewForBooking(bookingId, req.user.userId);
    }

    @Get('boat/:boatId/rating')
    async getBoatRating(@Param('boatId', ParseIntPipe) boatId: number) {
        const ratingData = await this.reviewService.getBoatAverageRating(boatId);
        return {
            boat_id: boatId,
            ...ratingData,
        };
    }


    @Get('boat/:boatId')
    async getBoatReviews(
        @Param('boatId', ParseIntPipe) boatId: number,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        
        return this.reviewService.getBoatReviews(boatId, pageNum, limitNum);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':reviewId')
    async deleteReview(
        @Param('reviewId', ParseIntPipe) reviewId: number,
        @Request() req,
    ) {
        return this.reviewService.deleteReview(reviewId, req.user.userId);
    }

}
