import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  ProductionReport,
  ProductionReportProps,
} from "@/domain/mes/enterprise/entities/production-report";

export function makeProductionReport(
  override: Partial<ProductionReportProps> = {},
  id?: UniqueEntityId
) {
  const workOrder = ProductionReport.create(
    {
      workOrderOperationId: new UniqueEntityId(),
      machineId: new UniqueEntityId(),
      machineOperatorId: new UniqueEntityId(),
      reportTime: new Date(),
      partsReported: faker.number.int({ min: 0, max: 100 }),
      elapsedTimeInSeconds: faker.number.int({ min: 0, max: 1000 }),
      scrapsReported: 0,
      type: "Production report",
      ...override,
    },
    id
  );

  return workOrder;
}
