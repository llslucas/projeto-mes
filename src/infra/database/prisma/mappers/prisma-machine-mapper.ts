import { Prisma, Machine as PrismaMachine } from "@prisma/client";
import {
  Machine,
  MachineStatus,
} from "@/domain/mes/enterprise/entities/machine";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export class PrismaMachineMapper {
  static toDomain(raw: PrismaMachine): Machine {
    if (!raw.id) {
      throw new Error("Invalid machine type");
    }

    return Machine.create(
      {
        name: raw.name,
        description: raw.description,
        status: raw.status as MachineStatus,
        sectorId: new UniqueEntityId(raw.sectorId),
        machineOperatorId: new UniqueEntityId(raw.machineOperatorId),
        workOrderOperationId: new UniqueEntityId(raw.workOrderOperationId),
        lastReportId: new UniqueEntityId(raw.lastReportId),
        lastReportTime: raw.lastReportTime,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(machine: Machine): Prisma.MachineUncheckedCreateInput {
    return {
      id: machine.id.toString(),
      sectorId: machine.sectorId.toString(),
      name: machine.name,
      description: machine.description,
      status: machine.status,
    };
  }
}
