import { Prisma, Report as PrismaShiftReport } from "@prisma/client";
import {
  ShiftReport,
  ShiftReportType,
} from "@/domain/mes/enterprise/entities/shift-report";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export class PrismaShiftReportMapper {
  static toDomain(raw: PrismaShiftReport): ShiftReport {
    if (!raw.id) {
      throw new Error("Invalid shift-report type");
    }

    return ShiftReport.create(
      {
        workOrderOperationId: new UniqueEntityId(raw.workOrderOperationId),
        machineId: new UniqueEntityId(raw.machineId),
        machineOperatorId: new UniqueEntityId(raw.machineOperatorId),
        type: raw.type as ShiftReportType,
        reportTime: raw.reportTime,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(shiftReport: ShiftReport): Prisma.ReportUncheckedCreateInput {
    return {
      machineId: shiftReport.machineId.toString(),
      workOrderOperationId: shiftReport.workOrderOperationId
        ? shiftReport.workOrderOperationId.toString()
        : null,
      machineOperatorId: shiftReport.machineOperatorId.toString(),
      type: shiftReport.type,
      reportTime: shiftReport.reportTime,
    };
  }
}
