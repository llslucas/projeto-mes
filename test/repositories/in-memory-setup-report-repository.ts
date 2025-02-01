import { SetupReportRepository } from "@/domain/mes/application/repositories/setup-report-repository";
import { SetupReport } from "@/domain/mes/enterprise/entities/setup-report";

export class InMemorySetupReportRepository implements SetupReportRepository {
  public items: SetupReport[] = [];

  async create(report: SetupReport) {
    this.items.push(report);
  }

  async createMany(reports: SetupReport[]) {
    this.items.push(...reports);
  }
}
