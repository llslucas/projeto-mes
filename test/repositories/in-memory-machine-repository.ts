import { MachineRepository } from "@/domain/mes/application/repositories/machine-repository";
import { Machine } from "@/domain/mes/enterprise/entities/machine";

export class InMemoryMachineRepository implements MachineRepository {
  public items: Machine[] = [];

  async findById(machineId: string): Promise<Machine> {
    return this.items.find((item) => item.id.toString() === machineId);
  }

  async create(machine: Machine) {
    this.items.push(machine);
  }
}
