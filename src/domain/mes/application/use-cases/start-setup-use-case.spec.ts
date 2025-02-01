import { InMemoryProductionReportRepository } from "test/repositories/in-memory-production-report-repository";
import { InMemoryWorkOrderOperationRepository } from "test/repositories/in-memory-work-order-operation-repository";
import { InMemoryMachineRepository } from "test/repositories/in-memory-machine-repository";
import { InMemoryMachineOperatorRepository } from "test/repositories/in-memory-machine-operator-repository";
import { makeMachine } from "test/factories/make-machine";
import { makeMachineOperator } from "test/factories/make-machine-operator";
import { makeWorkOrderOperation } from "test/factories/make-work-order-operation";
import { InMemorySetupReportRepository } from "test/repositories/in-memory-setup-report-repository";
import { makeSetupReport } from "test/factories/make-setup-report";
import { StartSetupUseCase } from "./start-setup-use-case";
import { MachineOperator } from "../../enterprise/entities/machine-operator";
import { WorkOrderOperation } from "../../enterprise/entities/work-order-operation";
import { Machine } from "../../enterprise/entities/machine";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

describe("Start setup use case", () => {
  let productionReportRepository: InMemoryProductionReportRepository;
  let setupReportRepository: InMemorySetupReportRepository;
  let workOrderOperationRepository: InMemoryWorkOrderOperationRepository;
  let machineRepository: InMemoryMachineRepository;
  let machineOperatorRepository: InMemoryMachineOperatorRepository;
  let sut: StartSetupUseCase;
  let machineOperator: MachineOperator;
  let workOrderOperation: WorkOrderOperation;
  let machine: Machine;

  beforeEach(async () => {
    setupReportRepository = new InMemorySetupReportRepository();
    setupReportRepository = new InMemorySetupReportRepository();
    workOrderOperationRepository = new InMemoryWorkOrderOperationRepository(
      productionReportRepository,
      setupReportRepository
    );
    machineRepository = new InMemoryMachineRepository();
    machineOperatorRepository = new InMemoryMachineOperatorRepository();

    sut = new StartSetupUseCase(
      workOrderOperationRepository,
      machineRepository,
      machineOperatorRepository
    );

    machineOperator = makeMachineOperator();
    workOrderOperation = makeWorkOrderOperation();

    machine = makeMachine({
      machineOperatorId: machineOperator.id,
      workOrderOperationId: workOrderOperation.id,
      status: "Produzindo",
    });

    machineOperatorRepository.items.push(machineOperator);
    workOrderOperationRepository.items.push(workOrderOperation);
    machineRepository.items.push(machine);
  });

  it("should create a setup report", async () => {
    const setupReport = makeSetupReport({
      workOrderOperationId: workOrderOperation.id,
      machineId: machine.id,
      machineOperatorId: machineOperator.id,
      type: "Setup start",
    });

    const result = await sut.execute({
      workOrderOperationId: setupReport.workOrderOperationId.toString(),
      machineId: setupReport.machineId.toString(),
      machineOperatorId: setupReport.machineOperatorId.toString(),
      reportTime: setupReport.reportTime,
    });

    const success = result.isRight();

    expect(success).toBe(true);

    if (success) {
      const newWorkOrderOperation = result.value.workOrderOperation;
      const workOrderOperationInRepository =
        workOrderOperationRepository.items[0];

      expect(newWorkOrderOperation).toEqual(workOrderOperationInRepository);
    }
  });

  it("should return a resource not found error if the work order operation did not exists", async () => {
    const setupReport = makeSetupReport({
      workOrderOperationId: new UniqueEntityId("Fake work order operation"),
      machineId: machine.id,
      machineOperatorId: machineOperator.id,
      type: "Setup start",
    });

    const result = await sut.execute({
      workOrderOperationId: setupReport.workOrderOperationId.toString(),
      machineId: setupReport.machineId.toString(),
      machineOperatorId: setupReport.machineOperatorId.toString(),
      reportTime: setupReport.reportTime,
    });

    const error = result.isLeft();

    expect(error).toBe(true);

    if (error) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("should return a resource not found error if the machine operator did not exists", async () => {
    const setupReport = makeSetupReport({
      workOrderOperationId: workOrderOperation.id,
      machineId: machine.id,
      machineOperatorId: new UniqueEntityId("Fake machine operator"),
      type: "Setup start",
    });

    const result = await sut.execute({
      workOrderOperationId: setupReport.workOrderOperationId.toString(),
      machineId: setupReport.machineId.toString(),
      machineOperatorId: setupReport.machineOperatorId.toString(),
      reportTime: setupReport.reportTime,
    });

    const error = result.isLeft();

    expect(error).toBe(true);

    if (error) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("should return a resource not found error if the machine did not exists", async () => {
    const setupReport = makeSetupReport({
      workOrderOperationId: workOrderOperation.id,
      machineId: new UniqueEntityId("Fake machine"),
      machineOperatorId: machineOperator.id,
      type: "Setup start",
    });

    const result = await sut.execute({
      workOrderOperationId: setupReport.workOrderOperationId.toString(),
      machineId: setupReport.machineId.toString(),
      machineOperatorId: setupReport.machineOperatorId.toString(),
      reportTime: setupReport.reportTime,
    });

    const error = result.isLeft();

    expect(error).toBe(true);

    if (error) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("should return a not allowed error if the machine status is different than Produzindo", async () => {
    machineRepository.items[0].status = "Fora de produção";

    const setupReport = makeSetupReport({
      workOrderOperationId: workOrderOperation.id,
      machineId: machine.id,
      machineOperatorId: machineOperator.id,
      type: "Setup start",
    });

    const result = await sut.execute({
      workOrderOperationId: setupReport.workOrderOperationId.toString(),
      machineId: setupReport.machineId.toString(),
      machineOperatorId: setupReport.machineOperatorId.toString(),
      reportTime: setupReport.reportTime,
    });

    const error = result.isLeft();

    expect(error).toBe(true);

    if (error) {
      expect(result.value).toBeInstanceOf(NotAllowedError);
    }
  });

  it("should return a not allowed error if the machine operator is different than the actual", async () => {
    const fakeMachineOperator = makeMachineOperator();
    machineOperatorRepository.items.push(fakeMachineOperator);

    const setupReport = makeSetupReport({
      workOrderOperationId: workOrderOperation.id,
      machineId: machine.id,
      machineOperatorId: fakeMachineOperator.id,
      type: "Setup start",
    });

    const result = await sut.execute({
      workOrderOperationId: setupReport.workOrderOperationId.toString(),
      machineId: setupReport.machineId.toString(),
      machineOperatorId: setupReport.machineOperatorId.toString(),
      reportTime: setupReport.reportTime,
    });

    const error = result.isLeft();

    expect(error).toBe(true);

    if (error) {
      expect(result.value).toBeInstanceOf(NotAllowedError);
    }
  });

  it("should return a not allowed error if the work order operation is different than the actual", async () => {
    const fakeWorkOrderOperation = makeWorkOrderOperation();
    workOrderOperationRepository.items.push(fakeWorkOrderOperation);

    const setupReport = makeSetupReport({
      workOrderOperationId: fakeWorkOrderOperation.id,
      machineId: machine.id,
      machineOperatorId: machineOperator.id,
      type: "Setup start",
    });

    const result = await sut.execute({
      workOrderOperationId: setupReport.workOrderOperationId.toString(),
      machineId: setupReport.machineId.toString(),
      machineOperatorId: setupReport.machineOperatorId.toString(),
      reportTime: setupReport.reportTime,
    });

    const error = result.isLeft();

    expect(error).toBe(true);

    if (error) {
      expect(result.value).toBeInstanceOf(NotAllowedError);
    }
  });
});
