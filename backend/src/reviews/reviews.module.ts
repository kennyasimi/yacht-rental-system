import { Module } from '@nestjs/common';
import { reviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';

@Module({
  providers: [reviewsService],
  controllers: [ReviewsController],
  exports: [reviewsService],
})
export class ReviewsModule {}
