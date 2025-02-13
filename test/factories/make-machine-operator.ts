import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  MachineOperator,
  MachineOperatorProps,
} from "@/domain/mes/enterprise/entities/machine-operator";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaMachineOperatorMapper } from "@/infra/database/prisma/mappers/prisma-machine-operator-mapper";

export function makeMachineOperator(
  override: Partial<MachineOperatorProps> = {},
  id?: UniqueEntityId
) {
  const machineOperator = MachineOperator.create(
    {
      sectorId: new UniqueEntityId(),
      number: faker.number.int({ min: 1, max: 999 }),
      name: faker.lorem.word(),
      ...override,
    },
    id
  );

  return machineOperator;
}

@Injectable()
export class MachineOperatorFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaMachineOperator(
    data?: Partial<MachineOperatorProps>,
    id?: UniqueEntityId
  ) {
    const machine = makeMachineOperator(data, id);

    await this.prismaService.machineOperator.create({
      data: PrismaMachineOperatorMapper.toPrisma(machine),
    });

    return machine;
  }
}
