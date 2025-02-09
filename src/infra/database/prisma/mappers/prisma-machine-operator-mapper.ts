import {
  Prisma,
  MachineOperator as PrismaMachineOperator,
} from "@prisma/client";
import {
  MachineOperator,
  MachineOperatorLevel,
} from "@/domain/mes/enterprise/entities/machine-operator";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export class PrismaMachineOperatorMapper {
  static toDomain(raw: PrismaMachineOperator): MachineOperator {
    if (!raw.id) {
      throw new Error("Invalid machine operator type");
    }

    return MachineOperator.create(
      {
        name: raw.name,
        number: raw.number,
        sectorId: new UniqueEntityId(raw.sectorId),
        level: raw.level as MachineOperatorLevel,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(
    machineOperator: MachineOperator
  ): Prisma.MachineOperatorUncheckedCreateInput {
    return {
      id: machineOperator.id.toString(),
      number: machineOperator.number,
      sectorId: machineOperator.sectorId.toString(),
      name: machineOperator.name,
      level: machineOperator.level,
    };
  }
}
