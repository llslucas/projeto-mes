import { InMemorySectorRepository } from "test/repositories/in-memory-sector-repository";
import { FetchSectorsUseCase } from "./fetch-sectors";
import { makeSector } from "test/factories/make-sector";

describe("Fetch sectors use case", () => {
  let sectorRepository: InMemorySectorRepository;

  let sut: FetchSectorsUseCase;

  beforeEach(async () => {
    sectorRepository = new InMemorySectorRepository();
    sut = new FetchSectorsUseCase(sectorRepository);
  });

  it("should be able to fetch all sectors", async () => {
    const sector = makeSector();
    const sector2 = makeSector();

    sectorRepository.items.push(sector, sector2);

    const result = await sut.execute();

    const success = result.isRight();

    expect(success).toBe(true);

    if (success) {
      expect(result.value.sectors).toEqual([sector, sector2]);
    }
  });

  it("should be able to search specific sectors by name", async () => {
    const sector = makeSector({
      name: "Test sector",
    });
    const sector2 = makeSector();

    sectorRepository.items.push(sector, sector2);

    const result = await sut.execute({
      search: "Test",
    });

    const success = result.isRight();

    expect(success).toBe(true);

    if (success) {
      expect(result.value.sectors).toEqual([sector]);
    }
  });
});
