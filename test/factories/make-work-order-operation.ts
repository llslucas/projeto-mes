import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  WorkOrderOperation,
  WorkOrderOperationProps,
} from "@/domain/mes/enterprise/entities/work-order-operation";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaWorkOrderOperationMapper } from "@/infra/database/prisma/mappers/prisma-work-order-operation-mapper";
import { Injectable } from "@nestjs/common";

export function makeWorkOrderOperation(
  override: Partial<WorkOrderOperationProps> = {},
  id?: UniqueEntityId
) {
  const workOrderOperation = WorkOrderOperation.create(
    {
      workOrderId: new UniqueEntityId(),
      number: faker.number.int({ min: 0, max: 100 }),
      description: faker.lorem.word(1),
      quantity: faker.number.int({ min: 0, max: 100 }),
      ...override,
    },
    id
  );

  return workOrderOperation;
}

@Injectable()
export class WorkOrderOperationFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaWorkOrderOperation(
    data?: Partial<WorkOrderOperationProps>,
    id?: UniqueEntityId
  ) {
    const workOrderOperation = makeWorkOrderOperation(data, id);

    await this.prismaService.workOrderOperation.create({
      data: PrismaWorkOrderOperationMapper.toPrisma(workOrderOperation),
    });

    return workOrderOperation;
  }
}
