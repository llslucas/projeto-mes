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
      number: faker.number.int(),
      description: faker.lorem.word(1),
      workOrderId: new UniqueEntityId(),
      ...override,
    },
    id
  );

  return workOrderOperation;
}
