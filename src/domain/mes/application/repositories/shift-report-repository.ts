import { ShiftReport } from "../../enterprise/entities/shift-report";

export abstract class ShiftReportRepository {
  abstract create(report: ShiftReport): Promise<void>;
}
