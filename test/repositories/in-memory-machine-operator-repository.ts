import { MachineOperatorRepository } from "@/domain/mes/application/repositories/machine-operator-repository";
import { MachineOperator } from "@/domain/mes/enterprise/entities/machine-operator";

export class InMemoryMachineOperatorRepository
  implements MachineOperatorRepository
{
  public items: MachineOperator[] = [];

  async create(machineOperator: MachineOperator) {
    this.items.push(machineOperator);
  }
}
