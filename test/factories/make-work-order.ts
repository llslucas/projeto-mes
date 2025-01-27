import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  WorkOrder,
  WorkOrderProps,
} from "@/domain/mes/enterprise/entities/work-order";

export function makeWorkOrder(
  override: Partial<WorkOrderProps> = {},
  id?: UniqueEntityId
) {
  const refDate = faker.date.soon();

  const workOrder = WorkOrder.create(
    {
      number: faker.number.int(),
      productName: faker.commerce.product(),
      productDescription: faker.commerce.productName(),
      deliveryDate: faker.date.soon({ refDate }),
      ...override,
    },
    id
  );

  return workOrder;
}
