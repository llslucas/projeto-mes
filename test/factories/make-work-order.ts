import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  WorkOrder,
  WorkOrderProps,
} from "@/domain/mes/enterprise/entities/work-order";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaWorkOrderMapper } from "@/infra/database/prisma/mappers/prisma-work-order-mapper";

export function makeWorkOrder(
  override: Partial<WorkOrderProps> = {},
  id?: UniqueEntityId
) {
  const refDate = faker.date.soon();

  const workOrder = WorkOrder.create(
    {
      number: faker.number.int({ min: 1, max: 999999 }),
      productName: faker.commerce.product(),
      productDescription: faker.commerce.productName(),
      deliveryDate: faker.date.soon({ refDate }),
      ...override,
    },
    id
  );

  return workOrder;
}

@Injectable()
export class WorkOrderFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaWorkOrder(
    data?: Partial<WorkOrderProps>,
    id?: UniqueEntityId
  ) {
    const workOrder = makeWorkOrder(data, id);

    await this.prismaService.workOrder.create({
      data: PrismaWorkOrderMapper.toPrisma(workOrder),
    });

    return workOrder;
  }
}
