import { Prisma, WorkOrder as PrismaWorkOrder } from "@prisma/client";
import { WorkOrder } from "@/domain/mes/enterprise/entities/work-order";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export class PrismaWorkOrderMapper {
  static toDomain(raw: PrismaWorkOrder): WorkOrder {
    if (!raw.id) {
      throw new Error("Invalid work-order type");
    }

    return WorkOrder.create(
      {
        sellOrderId: new UniqueEntityId(raw.sellOrderId),
        number: raw.number,
        productName: raw.productDescription,
        productDescription: raw.productDescription,
        deliveryDate: raw.deliveryDate,
        status: raw.status,
        comments: raw.comments,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(workOrder: WorkOrder): Prisma.WorkOrderUncheckedCreateInput {
    return {
      sellOrderId: workOrder.sellOrderId.toString(),
      number: workOrder.number,
      productName: workOrder.productDescription,
      productDescription: workOrder.productDescription,
      deliveryDate: workOrder.deliveryDate,
      status: workOrder.status,
      comments: workOrder.comments,
    };
  }
}
