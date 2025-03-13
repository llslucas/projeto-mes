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
        machineOperatorId: raw.machineOperatorId
          ? new UniqueEntityId(raw.machineOperatorId)
          : null,
        workOrderOperationId: raw.workOrderOperationId
          ? new UniqueEntityId(raw.workOrderOperationId)
          : null,
        lastReportId: raw.lastReportId
          ? new UniqueEntityId(raw.lastReportId)
          : null,
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
      name: machine.name,
      sectorId: machine.sectorId.toString(),
      machineOperatorId: machine.machineOperatorId
        ? machine.machineOperatorId.toString()
        : null,
      workOrderOperationId: machine.workOrderOperationId
        ? machine.workOrderOperationId.toString()
        : null,
      lastReportId: machine.lastReportId
        ? machine.lastReportId.toString()
        : null,
      lastReportTime: machine.lastReportTime,
      description: machine.description,
      status: machine.status,
    };
  }
}
