import { Prisma, Sector as PrismaSector } from "@prisma/client";
import { Sector } from "@/domain/mes/enterprise/entities/sector";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export class PrismaSectorMapper {
  static toDomain(raw: PrismaSector): Sector {
    if (!raw.id) {
      throw new Error("Invalid sector type");
    }

    return Sector.create(
      {
        name: raw.name,
        description: raw.description,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(sector: Sector): Prisma.SectorUncheckedCreateInput {
    return {
      id: sector.id.toString(),
      name: sector.name,
      description: sector.description,
    };
  }
}
