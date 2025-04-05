import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { MachineOperatorRepository } from "@/domain/mes/application/repositories/machine-operator-repository";
import { PrismaMachineOperatorRepository } from "./prisma/repositories/prisma-machine-operator-repository";
import { MachineRepository } from "@/domain/mes/application/repositories/machine-repository";
import { ProductionReportRepository } from "@/domain/mes/application/repositories/production-report-repository";
import { SectorRepository } from "@/domain/mes/application/repositories/sector-repository";
import { SellOrderRepository } from "@/domain/mes/application/repositories/sell-order-repository";
import { SetupReportRepository } from "@/domain/mes/application/repositories/setup-report-repository";
import { ShiftReportRepository } from "@/domain/mes/application/repositories/shift-report-repository";
import { WorkOrderOperationRepository } from "@/domain/mes/application/repositories/work-order-operation-repository";
import { WorkOrderRepository } from "@/domain/mes/application/repositories/work-order-repository";
import { PrismaMachineRepository } from "./prisma/repositories/prisma-machine-repository";
import { PrismaProductionReportRepository } from "./prisma/repositories/prisma-production-report-repository";
import { PrismaSectorRepository } from "./prisma/repositories/prisma-sector-repository";
import { PrismaSellOrderRepository } from "./prisma/repositories/prisma-sell-order-repository";
import { PrismaSetupReportRepository } from "./prisma/repositories/prisma-setup-report-repository";
import { PrismaShiftReportRepository } from "./prisma/repositories/prisma-shift-report-repository";
import { PrismaWorkOrderOperationRepository } from "./prisma/repositories/prisma-work-order-operation-repository";
import { PrismaWorkOrderRepository } from "./prisma/repositories/prisma-work-order-repository";
import { UserRepository } from "@/domain/mes/application/repositories/user-repository";
import { PrismaUserRepository } from "./prisma/repositories/prisma-user-repository";

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: SectorRepository,
      useClass: PrismaSectorRepository,
    },
    {
      provide: MachineRepository,
      useClass: PrismaMachineRepository,
    },
    {
      provide: MachineOperatorRepository,
      useClass: PrismaMachineOperatorRepository,
    },
    {
      provide: SellOrderRepository,
      useClass: PrismaSellOrderRepository,
    },
    {
      provide: WorkOrderRepository,
      useClass: PrismaWorkOrderRepository,
    },
    {
      provide: WorkOrderOperationRepository,
      useClass: PrismaWorkOrderOperationRepository,
    },
    {
      provide: ProductionReportRepository,
      useClass: PrismaProductionReportRepository,
    },
    {
      provide: SetupReportRepository,
      useClass: PrismaSetupReportRepository,
    },
    {
      provide: ShiftReportRepository,
      useClass: PrismaShiftReportRepository,
    },
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [
    PrismaService,
    SectorRepository,
    MachineRepository,
    MachineOperatorRepository,
    SellOrderRepository,
    WorkOrderRepository,
    WorkOrderOperationRepository,
    ProductionReportRepository,
    SetupReportRepository,
    ShiftReportRepository,
    UserRepository,
  ],
})
export class DatabaseModule {}
