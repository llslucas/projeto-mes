import { MachineOperatorRepository } from "@/domain/mes/application/repositories/machine-operator-repository";
import { MachineOperator } from "@/domain/mes/enterprise/entities/machine-operator";

export class InMemoryMachineOperatorRepository
  implements MachineOperatorRepository
{
  public items: MachineOperator[] = [];

  async findById(machineOperatorId: string): Promise<MachineOperator | null> {
    const machineOperator = this.items.find(
      (item) => item.id.toString() === machineOperatorId
    );

    if (!machineOperator) {
      return null;
    }

    return machineOperator;
  }

  async findByNumber(number: number): Promise<MachineOperator | null> {
    const machineOperator = this.items.find((item) => item.number === number);

    if (!machineOperator) {
      return null;
    }

    return machineOperator;
  }

  async create(machineOperator: MachineOperator) {
    this.items.push(machineOperator);
  }
}
