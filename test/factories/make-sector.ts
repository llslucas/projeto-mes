import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Sector, SectorProps } from "@/domain/mes/enterprise/entities/sector";

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
