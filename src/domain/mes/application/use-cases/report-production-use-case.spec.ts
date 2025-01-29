import { InMemoryProductionReportRepository } from "test/repositories/in-memory-production-report-repository";
import { InMemoryWorkOrderOperationRepository } from "test/repositories/in-memory-work-order-operation-repository";
import { InMemoryMachineRepository } from "test/repositories/in-memory-machine-repository";
import { InMemoryMachineOperatorRepository } from "test/repositories/in-memory-machine-operator-repository";
import { makeMachine } from "test/factories/make-machine";
import { makeMachineOperator } from "test/factories/make-machine-operator";
import { makeWorkOrderOperation } from "test/factories/make-work-order-operation";
import { makeProductionReport } from "test/factories/make-production-report";
import { ReportProductionUseCase } from "./report-production-use-case";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

describe("Create production report use case", () => {
  let productionReportRepository: InMemoryProductionReportRepository;
  let workOrderOperationRepository: InMemoryWorkOrderOperationRepository;
  let machineRepository: InMemoryMachineRepository;
  let machineOperatorRepository: InMemoryMachineOperatorRepository;
  let sut: ReportProductionUseCase;

  beforeAll(async () => {
    productionReportRepository = new InMemoryProductionReportRepository();
    workOrderOperationRepository = new InMemoryWorkOrderOperationRepository(
      productionReportRepository
    );
    machineRepository = new InMemoryMachineRepository();
    machineOperatorRepository = new InMemoryMachineOperatorRepository();

    sut = new ReportProductionUseCase(
      workOrderOperationRepository,
      machineRepository,
      machineOperatorRepository
    );
  });

  it("should create a production report", async () => {
    const machine = makeMachine();
    machineRepository.items.push(machine);

    const machineOperator = makeMachineOperator();
    machineOperatorRepository.items.push(machineOperator);

    const workOrderOperation = makeWorkOrderOperation();
    workOrderOperationRepository.items.push(workOrderOperation);

    const productionReport = makeProductionReport({
      workOrderOperationId: workOrderOperation.id,
      machineId: machine.id,
      machineOperatorId: machineOperator.id,
      partsReported: workOrderOperation.quantity,
    });

    const result = await sut.execute({
      workOrderOperationId: productionReport.workOrderOperationId.toString(),
      machineId: productionReport.machineId.toString(),
      machineOperatorId: productionReport.machineOperatorId.toString(),
      reportTime: productionReport.reportTime,
      elapsedTimeInSeconds: productionReport.elapsedTimeInSeconds,
      partsReported: productionReport.partsReported,
      scrapsReported: productionReport.scrapsReported,
    });

    const success = result.isRight();

    expect(success).toBe(true);

    if (success) {
      const newWorkOrderOperation = result.value.workOrderOperation;
      const workOrderOperationInRepository =
        workOrderOperationRepository.items[0];
      const productionReportInRepository = productionReportRepository.items[0];

      expect(newWorkOrderOperation).toEqual(workOrderOperationInRepository);

      expect(
        workOrderOperationInRepository.productionReports.currentItems
      ).toHaveLength(1);

      expect(productionReportInRepository).toEqual(
        workOrderOperationInRepository.productionReports.currentItems[0]
      );
    }
  });

  it("should return a ResourceNotFound error when the work order operation does not exists.", async () => {
    const machine = makeMachine();
    machineRepository.items.push(machine);

    const machineOperator = makeMachineOperator();
    machineOperatorRepository.items.push(machineOperator);

    const productionReport = makeProductionReport({
      machineId: machine.id,
      machineOperatorId: machineOperator.id,
    });

    const result = await sut.execute({
      workOrderOperationId: productionReport.workOrderOperationId.toString(),
      machineId: productionReport.machineId.toString(),
      machineOperatorId: productionReport.machineOperatorId.toString(),
      reportTime: productionReport.reportTime,
      elapsedTimeInSeconds: productionReport.elapsedTimeInSeconds,
      partsReported: productionReport.partsReported,
      scrapsReported: productionReport.scrapsReported,
    });

    const error = result.isLeft();

    expect(error).toBe(true);

    if (error) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("should return a ResourceNotFound error when the machine does not exists.", async () => {
    const machineOperator = makeMachineOperator();
    machineOperatorRepository.items.push(machineOperator);

    const workOrderOperation = makeWorkOrderOperation();
    workOrderOperationRepository.items.push(workOrderOperation);

    const productionReport = makeProductionReport({
      workOrderOperationId: workOrderOperation.id,
      machineOperatorId: machineOperator.id,
      partsReported: workOrderOperation.quantity,
    });

    const result = await sut.execute({
      workOrderOperationId: productionReport.workOrderOperationId.toString(),
      machineId: productionReport.machineId.toString(),
      machineOperatorId: productionReport.machineOperatorId.toString(),
      reportTime: productionReport.reportTime,
      elapsedTimeInSeconds: productionReport.elapsedTimeInSeconds,
      partsReported: productionReport.partsReported,
      scrapsReported: productionReport.scrapsReported,
    });

    const error = result.isLeft();

    expect(error).toBe(true);

    if (error) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("should return a ResourceNotFound error when the machine operator does not exists.", async () => {
    const machine = makeMachine();
    machineRepository.items.push(machine);

    const workOrderOperation = makeWorkOrderOperation();
    workOrderOperationRepository.items.push(workOrderOperation);

    const productionReport = makeProductionReport({
      workOrderOperationId: workOrderOperation.id,
      machineId: machine.id,
      partsReported: workOrderOperation.quantity,
    });

    const result = await sut.execute({
      workOrderOperationId: productionReport.workOrderOperationId.toString(),
      machineId: productionReport.machineId.toString(),
      machineOperatorId: productionReport.machineOperatorId.toString(),
      reportTime: productionReport.reportTime,
      elapsedTimeInSeconds: productionReport.elapsedTimeInSeconds,
      partsReported: productionReport.partsReported,
      scrapsReported: productionReport.scrapsReported,
    });

    const error = result.isLeft();

    expect(error).toBe(true);

    if (error) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("should return a NotAllowedError error when number of parts reported is bigger than the operation balance", async () => {
    const machine = makeMachine();
    machineRepository.items.push(machine);

    const machineOperator = makeMachineOperator();
    machineOperatorRepository.items.push(machineOperator);

    const workOrderOperation = makeWorkOrderOperation();
    workOrderOperationRepository.items.push(workOrderOperation);

    const productionReport = makeProductionReport({
      workOrderOperationId: workOrderOperation.id,
      machineId: machine.id,
      machineOperatorId: machineOperator.id,
      partsReported: workOrderOperation.quantity + 1,
    });

    const result = await sut.execute({
      workOrderOperationId: productionReport.workOrderOperationId.toString(),
      machineId: productionReport.machineId.toString(),
      machineOperatorId: productionReport.machineOperatorId.toString(),
      reportTime: productionReport.reportTime,
      elapsedTimeInSeconds: productionReport.elapsedTimeInSeconds,
      partsReported: productionReport.partsReported,
      scrapsReported: productionReport.scrapsReported,
    });

    const error = result.isLeft();

    expect(error).toBe(true);

    if (error) {
      expect(result.value).toBeInstanceOf(NotAllowedError);
    }
  });
});
