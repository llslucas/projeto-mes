import { Machine } from "../../enterprise/entities/machine";

export abstract class MachineRepository {
  abstract findById(machineId: string): Promise<Machine>;
  abstract findManyBySectorId(sectorId: string): Promise<Machine[]>;
  abstract create(machine: Machine): Promise<void>;
  abstract save(machine: Machine): Promise<void>;
}
