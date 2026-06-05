import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const userSelect = {
  id: true,
  email: true,
  role: true,
  fullName: true,
  phone: true,
  address: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async createEmployee(dto: CreateEmployeeDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await this.authService.hashPassword(dto.password);

    return this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        role: dto.role,
        fullName: dto.fullName,
        phone: dto.phone,
      },
      select: userSelect,
    });
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: userSelect,
    });
  }

  async updateProfile(userId: number, dto: UpdateUserDto) {
    await this.findById(userId);

    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: userSelect,
    });
  }

  async getUserOrders(userId: number) {
    await this.findById(userId);

    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            ingredients: true,
            product: true,
            customPizza: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
