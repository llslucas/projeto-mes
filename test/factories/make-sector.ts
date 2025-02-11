import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Sector, SectorProps } from "@/domain/mes/enterprise/entities/sector";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaSectorMapper } from "@/infra/database/prisma/mappers/prisma-sector-mapper";

export function makeSector(
  override: Partial<SectorProps> = {},
  id?: UniqueEntityId
) {
  const sector = Sector.create(
    {
      name: faker.lorem.word(),
      description: faker.lorem.paragraph(),
      ...override,
    },
    id
  );

  return sector;
}

@Injectable()
export class SectorFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaSector(data?: Partial<SectorProps>, id?: UniqueEntityId) {
    const sector = makeSector(data, id);

    await this.prismaService.sector.create({
      data: PrismaSectorMapper.toPrisma(sector),
    });

    return sector;
  }
}
