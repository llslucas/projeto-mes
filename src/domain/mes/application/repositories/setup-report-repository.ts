import { SetupReport } from "../../enterprise/entities/setup-report";

export abstract class SetupReportRepository {
  abstract create(report: SetupReport): Promise<void>;
  abstract createMany(reports: SetupReport[]): Promise<void>;
}
