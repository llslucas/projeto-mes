import { InMemoryMachineRepository } from "test/repositories/in-memory-machine-repository";
import { FetchMachinesUseCase } from "./fetch-machines";
import { makeMachine } from "test/factories/make-machine";
import { InMemoryMachineOperatorRepository } from "test/repositories/in-memory-machine-operator-repository";
import { makeMachineOperator } from "test/factories/make-machine-operator";

describe("Fetch machines use case", () => {
  let machineRepository: InMemoryMachineRepository;
  let machineOperatorRepository: InMemoryMachineOperatorRepository;

  let sut: FetchMachinesUseCase;

  beforeEach(async () => {
    machineRepository = new InMemoryMachineRepository();
    machineOperatorRepository = new InMemoryMachineOperatorRepository();

    sut = new FetchMachinesUseCase(
      machineOperatorRepository,
      machineRepository
    );
  });

  it("should be able to fetch machines by sector id", async () => {
    const machine = makeMachine();
    const machine2 = makeMachine();

    const machineOperator = makeMachineOperator({
      sectorId: machine.sectorId,
    });

    machineRepository.items.push(machine, machine2);
    machineOperatorRepository.items.push(machineOperator);

    const result = await sut.execute({
      machineOperatorId: machineOperator.id.toString(),
    });

    const success = result.isRight();

    expect(success).toBe(true);

    if (success) {
      expect(result.value.machines).toEqual([machine]);
    }
  });
});
