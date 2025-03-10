import { WorkOrderOperationRepository } from "@/domain/mes/application/repositories/work-order-operation-repository";
import { WorkOrderOperation } from "@/domain/mes/enterprise/entities/work-order-operation";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaWorkOrderOperationMapper } from "../mappers/prisma-work-order-operation-mapper";

@Injectable()
export class PrismaWorkOrderOperationRepository
  implements WorkOrderOperationRepository
{
  constructor(private prismaService: PrismaService) {}
  async findById(
    workOrderOperationId: string
  ): Promise<WorkOrderOperation | null> {
    const workOrderOperation =
      await this.prismaService.workOrderOperation.findUnique({
        where: { id: workOrderOperationId },
      });

    return workOrderOperation
      ? PrismaWorkOrderOperationMapper.toDomain(workOrderOperation)
      : null;
  }

  async findManyByWorkOrderId(
    workOrderId: string
  ): Promise<WorkOrderOperation[] | null> {
    const workOrderOperations =
      await this.prismaService.workOrderOperation.findMany({
        where: { workOrderId },
      });

    return workOrderOperations.map(PrismaWorkOrderOperationMapper.toDomain);
  }

  async create(workOrderOperation: WorkOrderOperation): Promise<void> {
    const data = PrismaWorkOrderOperationMapper.toPrisma(workOrderOperation);

    await this.prismaService.workOrderOperation.create({
      data,
    });
  }

  async save(workOrderOperation: WorkOrderOperation): Promise<void> {
    const data = PrismaWorkOrderOperationMapper.toPrisma(workOrderOperation);

    await this.prismaService.workOrderOperation.update({
      where: { id: workOrderOperation.id.toString() },
      data,
    });
  }
}
