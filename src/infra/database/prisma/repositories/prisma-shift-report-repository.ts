import { ShiftReportRepository } from "@/domain/mes/application/repositories/shift-report-repository";
import { ShiftReport } from "@/domain/mes/enterprise/entities/shift-report";
import { PrismaShiftReportMapper } from "../mappers/prisma-shift-report-mapper";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaShiftReportRepository implements ShiftReportRepository {
  constructor(private prismaService: PrismaService) {}
  async createMany(reports: ShiftReport[]): Promise<void> {
    const data = reports.map(PrismaShiftReportMapper.toPrisma);

    await this.prismaService.report.createMany({
      data,
    });
  }

  async create(shiftReport: ShiftReport): Promise<void> {
    const data = PrismaShiftReportMapper.toPrisma(shiftReport);

    await this.prismaService.report.create({
      data,
    });
  }
}
