import { MachineOperator } from "../../enterprise/entities/machine-operator";

export abstract class MachineOperatorRepository {
  abstract findById(machineOperatorId: string): Promise<MachineOperator | null>;
  abstract findByNumber(number: number): Promise<MachineOperator | null>;
  abstract create(machineOperator: MachineOperator): Promise<void>;
}
