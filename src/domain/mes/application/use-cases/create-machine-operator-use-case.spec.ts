import { makeMachineOperator } from "test/factories/make-machine-operator";
import { InMemoryMachineOperatorRepository } from "test/repositories/in-memory-machine-operator-repository";
import { CreateMachineOperatorUseCase } from "./create-machine-operator-use-case";
import { InMemorySectorRepository } from "test/repositories/in-memory-sector-repository";
import { makeSector } from "test/factories/make-sector";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

describe("Create machine operator use case", () => {
  let sectorRepository: InMemorySectorRepository;
  let machineOperatorRepository: InMemoryMachineOperatorRepository;
  let sut: CreateMachineOperatorUseCase;

  beforeEach(async () => {
    sectorRepository = new InMemorySectorRepository();
    machineOperatorRepository = new InMemoryMachineOperatorRepository();
    sut = new CreateMachineOperatorUseCase(
      sectorRepository,
      machineOperatorRepository
    );
  });

  it("should create a machine operator", async () => {
    const sector = makeSector();

    await sectorRepository.create(sector);

    const machineOperator = makeMachineOperator();

    const result = await sut.execute({
      sectorId: sector.id,
      name: machineOperator.name,
      number: machineOperator.number,
      level: machineOperator.level,
    });

    const success = result.isRight();

    expect(success).toBe(true);

    if (success) {
      const machineOperatorOnRepository = machineOperatorRepository.items[0];
      expect(machineOperatorOnRepository).toEqual(result.value.machineOperator);
    }
  });

  it("should return a NotFoundError if the sector did not exists", async () => {
    const machineOperator = makeMachineOperator();

    const result = await sut.execute({
      sectorId: new UniqueEntityId("Fake sector"),
      name: machineOperator.name,
      number: machineOperator.number,
      level: machineOperator.level,
    });

    const error = result.isLeft();

    expect(error).toBe(true);

    if (error) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });
});
