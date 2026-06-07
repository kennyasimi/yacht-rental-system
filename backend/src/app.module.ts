import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { BoatsModule } from './boats/boats.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [UsersModule, AuthModule, PrismaModule, BoatsModule, BookingsModule, PaymentsModule, ReviewsModule, ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,  // make ConfigService available everywhere
      envFilePath: '.env',  // Explicitly specify .env file path
    }),],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
