import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  Machine,
  MachineProps,
} from "@/domain/mes/enterprise/entities/machine";

export function makeMachine(
  override: Partial<MachineProps> = {},
  id?: UniqueEntityId
) {
  const machine = Machine.create(
    {
      sectorId: new UniqueEntityId(),
      name: faker.lorem.word(),
      description: faker.lorem.paragraph(),
      ...override,
    },
    id
  );

  return machine;
}
