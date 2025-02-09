import { WorkOrderRepository } from "@/domain/mes/application/repositories/work-order-repository";
import { WorkOrder } from "@/domain/mes/enterprise/entities/work-order";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaWorkOrderMapper } from "../mappers/prisma-work-order-mapper";

@Injectable()
export class PrismaWorkOrderRepository implements WorkOrderRepository {
  constructor(private prismaService: PrismaService) {}

  async findById(workOrderId: string): Promise<WorkOrder | null> {
    const workOrder = await this.prismaService.workOrder.findUnique({
      where: { id: workOrderId },
    });

    return workOrder ? PrismaWorkOrderMapper.toDomain(workOrder) : null;
  }

  async findByNumber(number: number): Promise<WorkOrder | null> {
    const workOrder = await this.prismaService.workOrder.findUnique({
      where: { number },
    });

    return workOrder ? PrismaWorkOrderMapper.toDomain(workOrder) : null;
  }

  async create(workOrder: WorkOrder): Promise<void> {
    const data = PrismaWorkOrderMapper.toPrisma(workOrder);

    await this.prismaService.workOrder.create({
      data,
    });
  }
}
