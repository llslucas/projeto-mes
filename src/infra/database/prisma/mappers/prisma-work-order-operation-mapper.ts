import {
  Prisma,
  WorkOrderOperation as PrismaWorkOrderOperation,
} from "@prisma/client";
import { WorkOrderOperation } from "@/domain/mes/enterprise/entities/work-order-operation";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export class PrismaWorkOrderOperationMapper {
  static toDomain(raw: PrismaWorkOrderOperation): WorkOrderOperation {
    if (!raw.id) {
      throw new Error("Invalid work-order-operation type");
    }

    return WorkOrderOperation.create(
      {
        workOrderId: new UniqueEntityId(raw.workOrderId),
        number: raw.number,
        description: raw.description,
        quantity: raw.quantity,
        balance: raw.balance,
        productionBegin: raw.productionBegin,
        productionEnd: raw.productionEnd,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(
    workOrderOperation: WorkOrderOperation
  ): Prisma.WorkOrderOperationUncheckedCreateInput {
    return {
      workOrderId: workOrderOperation.workOrderId.toString(),
      number: workOrderOperation.number,
      description: workOrderOperation.description,
      quantity: workOrderOperation.quantity,
      balance: workOrderOperation.balance,
      productionBegin: workOrderOperation.productionBegin,
      productionEnd: workOrderOperation.productionEnd,
    };
  }
}
