import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/updateuser.dto';
import { ChangePasswordDto } from './dto/changepassword.dto';
import { DeleteUserDto } from './dto/deleteuser.dto';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserById(userId: number) {
    return this.prisma.users.findUnique({
      where: { user_id: userId },
    });
  }

  async getAllUsers() {
    return this.prisma.users.findMany();
  }

  async updateUser(userId: number, dto: UpdateUserDto) {

    const updateData: Partial<{
      email: string;
      first_name: string;
      last_name: string;
      phone: string;
    }> = {};

    if (dto.new_email) updateData.email = dto.new_email;
    if (dto.first_name !== undefined) updateData.first_name = dto.first_name;
    if (dto.last_name !== undefined) updateData.last_name = dto.last_name;
    if (dto.phone !== undefined) updateData.phone = dto.phone;

    return this.prisma.users.update({
      where: { user_id: userId },
      data: updateData,
    });
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const { old_password, new_password, password_confirm } = dto;

    // 1. Ensure all fields are filled
    if (!old_password || !new_password || !password_confirm) {
        throw new BadRequestException('All password fields are required');
    }

    // 2. Verify new password matches the confirmation
    if (new_password !== password_confirm) {
        throw new BadRequestException('New password and confirmation do not match');
    }

    
    const user = await this.prisma.users.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    const passwordMatches = await bcrypt.compare(
      dto.old_password,
      user.password_hash!,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Current password incorrect');
    }
    const hashedPassword = await bcrypt.hash(dto.new_password!, 10);

    return this.prisma.users.update({
      where: { user_id: userId },
      data: {
        password_hash: hashedPassword,
      },
    });
  }

  async deleteUser(userId: number, dto: DeleteUserDto) {
    const user = await this.prisma.users.findUnique({ where: { user_id: userId } });
    
    // Verify password before any deletion logic
    const isValid = await bcrypt.compare(dto.password, user!.password_hash!);
    if (!isValid) throw new UnauthorizedException('Incorrect password');

    return this.prisma.users.delete({ where: { user_id: userId } });
}
}