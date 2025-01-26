import { Machine } from "../../enterprise/entities/Machine";

export abstract class MachineRepository {
  abstract create(machine: Machine): Promise<void>;
}
