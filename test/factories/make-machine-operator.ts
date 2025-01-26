import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  MachineOperator,
  MachineOperatorProps,
} from "@/domain/mes/enterprise/entities/machine-operator";

export function makeMachineOperator(
  override: Partial<MachineOperatorProps> = {},
  id?: UniqueEntityId
) {
  const machineOperator = MachineOperator.create(
    {
      sectorId: new UniqueEntityId(),
      number: faker.number.int(),
      name: faker.lorem.word(),
      ...override,
    },
    id
  );

  return machineOperator;
}
