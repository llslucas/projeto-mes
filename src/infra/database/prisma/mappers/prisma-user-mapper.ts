import { Prisma, User as PrismaUser } from "@prisma/client";

import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { User, USER_ROLES } from "@/domain/mes/enterprise/entities/user";

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    if (!raw.id) {
      throw new Error("Invalid user type");
    }

    return User.create(
      {
        name: raw.name,
        role: raw.role as USER_ROLES,
        password: raw.password,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      name: user.name,
      password: user.password,
      role: user.role,
    };
  }
}
