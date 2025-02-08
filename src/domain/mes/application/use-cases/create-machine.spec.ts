import { makeMachine } from "test/factories/make-machine";
import { InMemoryMachineRepository } from "test/repositories/in-memory-machine-repository";
import { CreateMachineUseCase } from "./create-machine";
import { InMemorySectorRepository } from "test/repositories/in-memory-sector-repository";
import { makeSector } from "test/factories/make-sector";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

describe("Create machine use case", () => {
  let sectorRepository: InMemorySectorRepository;
  let machineRepository: InMemoryMachineRepository;
  let sut: CreateMachineUseCase;

  beforeEach(async () => {
    sectorRepository = new InMemorySectorRepository();
    machineRepository = new InMemoryMachineRepository();
    sut = new CreateMachineUseCase(sectorRepository, machineRepository);
  });

  it("should create a machine", async () => {
    const sector = makeSector();

    await sectorRepository.create(sector);

    const machine = makeMachine();

    const result = await sut.execute({
      sectorId: sector.id,
      name: machine.name,
      description: machine.description,
    });

    const success = result.isRight();

    expect(success).toBe(true);

    if (success) {
      const machineOnRepository = machineRepository.items[0];
      expect(machineOnRepository).toEqual(result.value.machine);
    }
  });

  it("should return a NotFoundError when the sector did not exists", async () => {
    const machine = makeMachine();

    const result = await sut.execute({
      sectorId: new UniqueEntityId("Fake Sector"),
      name: machine.name,
      description: machine.description,
    });

    const error = result.isLeft();

    expect(error).toBe(true);

    if (error) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });
});
