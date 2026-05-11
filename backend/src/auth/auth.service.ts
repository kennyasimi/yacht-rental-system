import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, first_name, last_name, phone} = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await this.prisma.users.create({
      data: {
        email,
        password_hash: password,
        first_name: first_name || null,
        last_name: last_name || null,
        phone: phone || null,
      },
    });

    // Generate JWT token
    const payload = { sub: user.user_id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    // Return response (exclude password)
    return {
      access_token,
      user: {
        user_id: user.user_id,
        email: user.email,
        name: user.first_name,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find the user
    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash!);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { sub: user.user_id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    // Return response
    return {
      access_token,
      user: {
        user_id: user.user_id,
        email: user.email,
        name: user.first_name,
      },
    };
  }

  async validateUser(userId: number) {
    const user = await this.prisma.users.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        email: true,
        name: true,
      },
    });
    return user;
  }
}
