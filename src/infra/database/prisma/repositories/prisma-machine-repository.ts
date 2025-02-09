import { MachineRepository } from "@/domain/mes/application/repositories/machine-repository";
import { Machine } from "@/domain/mes/enterprise/entities/machine";
import { PrismaMachineMapper } from "../mappers/prisma-machine-mapper";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaMachineRepository implements MachineRepository {
  constructor(private prismaService: PrismaService) {}

  async findById(machineId: string): Promise<Machine | null> {
    const machine = await this.prismaService.machine.findUnique({
      where: { id: machineId },
    });

    return machine ? PrismaMachineMapper.toDomain(machine) : null;
  }

  async findManyBySectorId(sectorId: string): Promise<Machine[]> {
    const machines = await this.prismaService.machine.findMany({
      where: { sectorId: sectorId },
    });

    return machines.map(PrismaMachineMapper.toDomain);
  }

  async create(machine: Machine): Promise<void> {
    const data = PrismaMachineMapper.toPrisma(machine);

    await this.prismaService.machine.create({
      data,
    });
  }

  async save(machine: Machine): Promise<void> {
    const data = PrismaMachineMapper.toPrisma(machine);

    await this.prismaService.machine.update({
      where: { id: machine.id.toString() },
      data,
    });
  }
}
