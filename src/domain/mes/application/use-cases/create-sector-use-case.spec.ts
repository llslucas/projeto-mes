import { makeSector } from "test/factories/make-sector";
import { InMemorySectorRepository } from "test/repositories/in-memory-sector-repository";
import { CreateSectorUseCase } from "./create-sector-use-case";

describe("Create sector use case", () => {
  let sectorRepository: InMemorySectorRepository;
  let sut: CreateSectorUseCase;

  beforeEach(async () => {
    sectorRepository = new InMemorySectorRepository();
    sut = new CreateSectorUseCase(sectorRepository);
  });

  it("should create a sector", async () => {
    const sector = makeSector();

    const result = await sut.execute({
      name: sector.name,
      description: sector.description,
    });

    const success = result.isRight();

    expect(success).toBe(true);

    if (success) {
      const sectorOnRepository = sectorRepository.items[0];
      expect(sectorOnRepository).toEqual(result.value.sector);
    }
  });
});
