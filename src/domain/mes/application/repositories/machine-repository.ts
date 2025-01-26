import { Machine } from "../../enterprise/entities/machine";

export abstract class MachineRepository {
  abstract create(machine: Machine): Promise<void>;
}
