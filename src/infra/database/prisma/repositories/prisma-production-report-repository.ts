import { ProductionReportRepository } from "@/domain/mes/application/repositories/production-report-repository";
import { ProductionReport } from "@/domain/mes/enterprise/entities/production-report";
import { PrismaProductionReportMapper } from "../mappers/prisma-production-report-mapper";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaProductionReportRepository
  implements ProductionReportRepository
{
  constructor(private prismaService: PrismaService) {}
  async createMany(reports: ProductionReport[]): Promise<void> {
    const data = reports.map(PrismaProductionReportMapper.toPrisma);

    await this.prismaService.report.createMany({
      data,
    });
  }

  async create(productionReport: ProductionReport): Promise<void> {
    const data = PrismaProductionReportMapper.toPrisma(productionReport);

    await this.prismaService.report.create({
      data,
    });
  }
}
