import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  SetupReport,
  SetupReportProps,
} from "@/domain/mes/enterprise/entities/setup-report";

export function makeSetupReport(
  override: Partial<SetupReportProps> = {},
  id?: UniqueEntityId
) {
  const workOrder = SetupReport.create(
    {
      workOrderOperationId: new UniqueEntityId(),
      machineId: new UniqueEntityId(),
      machineOperatorId: new UniqueEntityId(),
      reportTime: new Date(),
      elapsedTimeInSeconds: null,
      type: "Setup start",
      ...override,
    },
    id
  );

  return workOrder;
}
