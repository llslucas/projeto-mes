import { ProductionReportRepository } from "@/domain/mes/application/repositories/production-report-repository";
import { ProductionReport } from "@/domain/mes/enterprise/entities/production-report";

export class InMemoryProductionReportRepository
  implements ProductionReportRepository
{
  public items: ProductionReport[] = [];

  async create(report: ProductionReport) {
    this.items.push(report);
  }

  async createMany(reports: ProductionReport[]) {
    this.items.push(...reports);
  }
}
