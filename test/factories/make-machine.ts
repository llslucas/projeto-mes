import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  Machine,
  MachineProps,
} from "@/domain/mes/enterprise/entities/machine";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaMachineMapper } from "@/infra/database/prisma/mappers/prisma-machine-mapper";

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

@Injectable()
export class MachineFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaMachine(data?: Partial<MachineProps>, id?: UniqueEntityId) {
    const machine = makeMachine(data, id);

    await this.prismaService.machine.create({
      data: PrismaMachineMapper.toPrisma(machine),
    });

    return machine;
  }
}
