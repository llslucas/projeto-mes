import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { UserRepository } from "@/domain/mes/application/repositories/user-repository";
import { User } from "@/domain/mes/enterprise/entities/user";
import { PrismaUserMapper } from "../mappers/prisma-user-mapper";

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prismaService: PrismaService) {}

  async findById(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    return user ? PrismaUserMapper.toDomain(user) : null;
  }

  async findByName(userName: string) {
    const user = await this.prismaService.user.findUnique({
      where: { name: userName },
    });

    return user ? PrismaUserMapper.toDomain(user) : null;
  }

  async create(user: User) {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prismaService.user.create({
      data,
    });
  }

  async save(user: User) {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prismaService.user.update({
      where: { id: user.id.toString() },
      data,
    });
  }
}
