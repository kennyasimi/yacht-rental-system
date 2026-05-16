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

@Module({
  imports: [UsersModule, AuthModule, PrismaModule, BoatsModule, BookingsModule, PaymentsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
