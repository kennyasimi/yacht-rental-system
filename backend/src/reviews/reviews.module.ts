import { Module } from '@nestjs/common';
import { reviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';

@Module({
  providers: [reviewsService],
  controllers: [ReviewsController]
})
export class ReviewsModule {}
