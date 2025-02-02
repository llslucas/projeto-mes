import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  ShiftReport,
  ShiftReportProps,
} from "@/domain/mes/enterprise/entities/shift-report";

export function makeShiftReport(
  override: Partial<ShiftReportProps> = {},
  id?: UniqueEntityId
) {
  const workOrder = ShiftReport.create(
    {
      machineId: new UniqueEntityId(),
      machineOperatorId: new UniqueEntityId(),
      reportTime: new Date(),
      elapsedTimeInSeconds: null,
      type: "Shift start",
      ...override,
    },
    id
  );

  return workOrder;
}
