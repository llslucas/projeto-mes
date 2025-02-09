import { SetupReportRepository } from "@/domain/mes/application/repositories/setup-report-repository";
import { SetupReport } from "@/domain/mes/enterprise/entities/setup-report";
import { PrismaSetupReportMapper } from "../mappers/prisma-setup-report-mapper";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaSetupReportRepository implements SetupReportRepository {
  constructor(private prismaService: PrismaService) {}
  async createMany(reports: SetupReport[]): Promise<void> {
    const data = reports.map(PrismaSetupReportMapper.toPrisma);

    await this.prismaService.report.createMany({
      data,
    });
  }

  async create(setupReport: SetupReport): Promise<void> {
    const data = PrismaSetupReportMapper.toPrisma(setupReport);

    await this.prismaService.report.create({
      data,
    });
  }
}
