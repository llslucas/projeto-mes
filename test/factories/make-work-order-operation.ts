import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  WorkOrderOperation,
  WorkOrderOperationProps,
} from "@/domain/mes/enterprise/entities/work-order-operation";

export function makeWorkOrderOperation(
  override: Partial<WorkOrderOperationProps> = {},
  id?: UniqueEntityId
) {
  const workOrderOperation = WorkOrderOperation.create(
    {
      workOrderId: new UniqueEntityId(),
      number: faker.number.int(),
      description: faker.lorem.word(1),
      quantity: faker.number.int({ min: 0, max: 100 }),
      ...override,
    },
    id
  );

  return workOrderOperation;
}
