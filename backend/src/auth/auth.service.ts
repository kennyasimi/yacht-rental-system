import { Injectable, UnauthorizedException, ConflictException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from './auth.enums';

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
        password_hash: hashedPassword, //major error , stored plain text password instead of hashed password
        first_name: first_name || null,
        last_name: last_name || null,
        phone: phone || null,
        role: UserRole.USER,
        created_at: new Date(),
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



 async createAdmin(createAdminDto: RegisterDto, currentUser: any) {
    if (currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can create new admin accounts');
    }
    const existingUser = await this.prisma.users.findUnique({
      where: { email: createAdminDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const hashed_password = await bcrypt.hash(createAdminDto.password, 10);
    return this.prisma.users.create({
             data: {
                first_name: createAdminDto.first_name,
                last_name: createAdminDto.last_name,  
                email: createAdminDto.email,
                password: hashed_password,
                role: UserRole.ADMIN,
                created_at: new Date()
             },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        createdAt: true,
        // Exclude password from response
      },
    });
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find the user
    const user = await this.prisma.users.findUnique({
      where: { email: loginDto.email },
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
    const payload = { sub: user.user_id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    // Return response
    return {
      access_token,
      user: {
        user_id: user.user_id,
        email: user.email,
        name: user.first_name,
        role: user.role
      },
    };
  }

  
  async validateUser(userId: number) {
    const user = await this.prisma.users.findUniqueOrThrow({
      where: { user_id: userId },
      select: {
        user_id: true,
        email: true,
        first_name: true,
      },
    });
    return user;
  }
}
