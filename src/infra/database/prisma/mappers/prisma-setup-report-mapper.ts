import { Prisma, Report as PrismaSetupReport } from "@prisma/client";
import {
  SetupReport,
  SetupReportType,
} from "@/domain/mes/enterprise/entities/setup-report";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export class PrismaSetupReportMapper {
  static toDomain(raw: PrismaSetupReport): SetupReport {
    if (!raw.id) {
      throw new Error("Invalid setup-report type");
    }

    return SetupReport.create(
      {
        workOrderOperationId: new UniqueEntityId(raw.workOrderOperationId),
        machineId: new UniqueEntityId(raw.machineId),
        machineOperatorId: new UniqueEntityId(raw.machineOperatorId),
        setupOperatorId: raw.setupOperatorId
          ? new UniqueEntityId(raw.setupOperatorId)
          : null,
        type: raw.type as SetupReportType,
        reportTime: raw.reportTime,
        elapsedTimeInSeconds: raw.elapsedTimeInSeconds,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(setupReport: SetupReport): Prisma.ReportUncheckedCreateInput {
    return {
      workOrderOperationId: setupReport.workOrderOperationId.toString(),
      machineId: setupReport.machineId.toString(),
      machineOperatorId: setupReport.machineOperatorId.toString(),
      type: setupReport.type,
      reportTime: setupReport.reportTime,
      elapsedTimeInSeconds: setupReport.elapsedTimeInSeconds,
      setupOperatorId: setupReport.setupOperatorId
        ? setupReport.setupOperatorId.toString()
        : null,
    };
  }
}
