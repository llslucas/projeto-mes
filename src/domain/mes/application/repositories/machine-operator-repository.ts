import { MachineOperator } from "../../enterprise/entities/machine-operator";

export abstract class MachineOperatorRepository {
  abstract create(machineOperator: MachineOperator): Promise<void>;
}
