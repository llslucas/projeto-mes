import { ProductionReport } from "../../enterprise/entities/production-report";

export abstract class ProductionReportRepository {
  abstract create(report: ProductionReport): Promise<void>;
  abstract createMany(reports: ProductionReport[]): Promise<void>;
}
