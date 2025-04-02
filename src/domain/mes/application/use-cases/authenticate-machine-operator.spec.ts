import { makeMachineOperator } from "test/factories/make-machine-operator";
import { InMemoryMachineOperatorRepository } from "test/repositories/in-memory-machine-operator-repository";
import { InMemorySectorRepository } from "test/repositories/in-memory-sector-repository";
import { makeSector } from "test/factories/make-sector";
import { AuthenticateMachineOperatorUseCase } from "./authenticate-machine-operator";
import { FakeEncrypter } from "test/cryptografy/fake-encrypter";

describe("Authenticate machine operator use case", () => {
  let sectorRepository: InMemorySectorRepository;
  let machineOperatorRepository: InMemoryMachineOperatorRepository;
  let fakeEncrypter: FakeEncrypter;
  let sut: AuthenticateMachineOperatorUseCase;

  beforeEach(async () => {
    sectorRepository = new InMemorySectorRepository();
    machineOperatorRepository = new InMemoryMachineOperatorRepository();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateMachineOperatorUseCase(
      machineOperatorRepository,
      fakeEncrypter
    );
  });

  it("should authenticate a machine operator", async () => {
    const sector = makeSector();
    await sectorRepository.create(sector);

    const machineOperator = makeMachineOperator();
    await machineOperatorRepository.create(machineOperator);

    const result = await sut.execute({
      operatorNumber: machineOperator.number,
    });

    const success = result.isRight();

    expect(success).toBe(true);

    if (success) {
      expect(result.value).toEqual({
        accessToken: JSON.stringify({
          sub: machineOperator.id.toString(),
          role: "OPERATOR",
        }),
      });
    }
  });
});
