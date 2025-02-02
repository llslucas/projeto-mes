import { ShiftReportRepository } from "@/domain/mes/application/repositories/shift-report-repository";
import { ShiftReport } from "@/domain/mes/enterprise/entities/shift-report";

export class InMemoryShiftReportRepository implements ShiftReportRepository {
  public items: ShiftReport[] = [];

  async create(report: ShiftReport) {
    this.items.push(report);
  }
}
