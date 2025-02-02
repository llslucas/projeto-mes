import { InMemoryMachineRepository } from "test/repositories/in-memory-machine-repository";
import { InMemoryMachineOperatorRepository } from "test/repositories/in-memory-machine-operator-repository";
import { makeMachine } from "test/factories/make-machine";
import { makeMachineOperator } from "test/factories/make-machine-operator";
import { MachineOperator } from "../../enterprise/entities/machine-operator";
import { Machine } from "../../enterprise/entities/machine";
import { InMemoryShiftReportRepository } from "test/repositories/in-memory-shift-report-repository";
import { StartShiftUseCase } from "./start-shift-use-case";
import { makeShiftReport } from "test/factories/make-shift-report";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

describe("Start shift use case", () => {
  let shiftReportRepository: InMemoryShiftReportRepository;
  let machineRepository: InMemoryMachineRepository;
  let machineOperatorRepository: InMemoryMachineOperatorRepository;
  let machineOperator: MachineOperator;
  let machine: Machine;
  let sut: StartShiftUseCase;

  beforeEach(async () => {
    shiftReportRepository = new InMemoryShiftReportRepository();
    machineRepository = new InMemoryMachineRepository();
    machineOperatorRepository = new InMemoryMachineOperatorRepository();

    sut = new StartShiftUseCase(
      machineRepository,
      machineOperatorRepository,
      shiftReportRepository
    );

    machineOperator = makeMachineOperator();

    machine = makeMachine({
      machineOperatorId: null,
      workOrderOperationId: null,
      status: "Fora de turno",
    });

    machineOperatorRepository.items.push(machineOperator);
    machineRepository.items.push(machine);
  });

  it("should be able to start a shift", async () => {
    const shiftReport = makeShiftReport({
      machineId: machine.id,
      machineOperatorId: machineOperator.id,
    });

    const result = await sut.execute({
      machineId: shiftReport.machineId.toString(),
      machineOperatorId: shiftReport.machineOperatorId.toString(),
      reportTime: shiftReport.reportTime,
    });

    const success = result.isRight();

    expect(success).toBe(true);

    if (success) {
      const shiftReportInRepository = shiftReportRepository.items[0];
      const machineInRepository = machineRepository.items[0];

      expect(shiftReportInRepository).toBeTruthy();
      expect(machineInRepository).toEqual(
        expect.objectContaining({
          status: "Fora de produção",
          machineOperatorId: machineOperator.id,
        })
      );
    }
  });

  it("should return a ResourceNotFoundError when the machine does not exists", async () => {
    const shiftReport = makeShiftReport({
      machineId: new UniqueEntityId("fake machine"),
      machineOperatorId: machineOperator.id,
    });

    const result = await sut.execute({
      machineId: shiftReport.machineId.toString(),
      machineOperatorId: shiftReport.machineOperatorId.toString(),
      reportTime: shiftReport.reportTime,
    });

    const error = result.isLeft();

    expect(error).toBe(true);

    if (error) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("should return a ResourceNotFoundError when the machine operator does not exists", async () => {
    const shiftReport = makeShiftReport({
      machineId: machine.id,
      machineOperatorId: new UniqueEntityId("fake machine operator"),
    });

    const result = await sut.execute({
      machineId: shiftReport.machineId.toString(),
      machineOperatorId: shiftReport.machineOperatorId.toString(),
      reportTime: shiftReport.reportTime,
    });

    const error = result.isLeft();

    expect(error).toBe(true);

    if (error) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("should return a NotAllowedError when the machine is already in use", async () => {
    machineRepository.items[0].machineOperatorId = machineOperator.id;
    machineRepository.items[0].status = "Produzindo";
    machineRepository.items[0].workOrderOperationId = new UniqueEntityId(
      "fake work order operation"
    );

    const shiftReport = makeShiftReport({
      machineId: machine.id,
      machineOperatorId: machineOperator.id,
    });

    const result = await sut.execute({
      machineId: shiftReport.machineId.toString(),
      machineOperatorId: shiftReport.machineOperatorId.toString(),
      reportTime: shiftReport.reportTime,
    });

    const error = result.isLeft();

    expect(error).toBe(true);

    if (error) {
      expect(result.value).toBeInstanceOf(NotAllowedError);
    }
  });
});
