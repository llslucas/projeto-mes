import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { User, UserProps } from "@/domain/mes/enterprise/entities/user";
import { PrismaUserMapper } from "@/infra/database/prisma/mappers/prisma-user-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityId
) {
  const user = User.create(
    {
      name: faker.internet.username(),
      role: "ADMIN",
      password: faker.internet.password(),
      ...override,
    },
    id
  );

  return user;
}

@Injectable()
export class UserFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaUser(data?: Partial<UserProps>, id?: UniqueEntityId) {
    const user = makeUser(data, id);

    await this.prismaService.user.create({
      data: PrismaUserMapper.toPrisma(user),
    });

    return user;
  }
}
