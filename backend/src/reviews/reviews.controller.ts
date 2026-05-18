import { Controller, Request, Param, Body, Post, UseGuards, ParseIntPipe } from '@nestjs/common';
import { reviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthController } from '../auth/auth.controller';
import { AuthGuard } from '@nestjs/passport';
import { createReviewDto } from './dto/reviw.dto';
import { dot } from 'node:test/reporters';
import { create } from 'domain';
@Controller('reviews')
export class ReviewsController {
    constructor (private reviewService: reviewsService) {}

    @UseGuards(JwtAuthGuard)
    @Post('me/review/:id')
    createReview(
            @Param('id', ParseIntPipe) bookingId: number,
            @Request() req,
            @Body() dto: createReviewDto
        ){
            return this.reviewService.createReview(
                req.user.userId,
                dto,
                bookingId

            )
        }
}
