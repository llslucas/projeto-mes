import { MachineOperatorRepository } from "@/domain/mes/application/repositories/machine-operator-repository";
import { MachineOperator } from "@/domain/mes/enterprise/entities/machine-operator";
import { PrismaMachineOperatorMapper } from "../mappers/prisma-machine-operator-mapper";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaMachineOperatorRepository
  implements MachineOperatorRepository
{
  constructor(private prismaService: PrismaService) {}

  async findById(machineOperatorId: string): Promise<MachineOperator | null> {
    const machineOperator = await this.prismaService.machineOperator.findUnique(
      {
        where: { id: machineOperatorId },
      }
    );

    return machineOperator
      ? PrismaMachineOperatorMapper.toDomain(machineOperator)
      : null;
  }

  async findByNumber(number: number): Promise<MachineOperator | null> {
    const machineOperator = await this.prismaService.machineOperator.findUnique(
      {
        where: { number },
      }
    );

    return machineOperator
      ? PrismaMachineOperatorMapper.toDomain(machineOperator)
      : null;
  }

  async create(machineOperator: MachineOperator): Promise<void> {
    const data = PrismaMachineOperatorMapper.toPrisma(machineOperator);

    await this.prismaService.machineOperator.create({
      data,
    });
  }
}
