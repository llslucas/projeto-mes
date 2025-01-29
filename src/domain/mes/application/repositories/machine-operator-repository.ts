import { MachineOperator } from "../../enterprise/entities/machine-operator";

export abstract class MachineOperatorRepository {
  abstract findById(machineOperatorId: string): Promise<MachineOperator>;
  abstract create(machineOperator: MachineOperator): Promise<void>;
}
