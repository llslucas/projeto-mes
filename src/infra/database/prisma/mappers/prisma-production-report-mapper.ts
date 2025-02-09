import { Prisma, Report as PrismaProductionReport } from "@prisma/client";
import {
  ProductionReport,
  ProductionReportType,
} from "@/domain/mes/enterprise/entities/production-report";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export class PrismaProductionReportMapper {
  static toDomain(raw: PrismaProductionReport): ProductionReport {
    if (!raw.id) {
      throw new Error("Invalid production-report type");
    }

    return ProductionReport.create(
      {
        workOrderOperationId: new UniqueEntityId(raw.workOrderOperationId),
        machineId: new UniqueEntityId(raw.machineId),
        machineOperatorId: new UniqueEntityId(raw.machineOperatorId),
        type: raw.type as ProductionReportType,
        partsReported: raw.partsReported,
        scrapsReported: raw.scrapsReported,
        reportTime: raw.reportTime,
        elapsedTimeInSeconds: raw.elapsedTimeInSeconds,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(
    productionReport: ProductionReport
  ): Prisma.ReportUncheckedCreateInput {
    return {
      workOrderOperationId: productionReport.workOrderOperationId.toString(),
      machineId: productionReport.machineId.toString(),
      machineOperatorId: productionReport.machineOperatorId.toString(),
      type: productionReport.type,
      partsReported: productionReport.partsReported,
      scrapsReported: productionReport.scrapsReported,
      reportTime: productionReport.reportTime,
      elapsedTimeInSeconds: productionReport.elapsedTimeInSeconds,
    };
  }
}
