import { InMemoryMachineRepository } from "test/repositories/in-memory-machine-repository";
import { FetchMachinesUseCase } from "./fetch-machines";
import { makeMachine } from "test/factories/make-machine";

describe("Fetch machines use case", () => {
  let machineRepository: InMemoryMachineRepository;

  let sut: FetchMachinesUseCase;

  beforeEach(async () => {
    machineRepository = new InMemoryMachineRepository();

    sut = new FetchMachinesUseCase(machineRepository);
  });

  it("should be able to fetch machines by sector id", async () => {
    const machine = makeMachine();
    const machine2 = makeMachine();

    machineRepository.items.push(machine, machine2);

    const result = await sut.execute({
      sectorId: machine.sectorId.toString(),
    });

    const success = result.isRight();

    expect(success).toBe(true);

    if (success) {
      expect(result.value.machines).toEqual([machine]);
    }
  });
});
