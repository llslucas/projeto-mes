import { InMemoryProductionReportRepository } from "test/repositories/in-memory-production-report-repository";
import { InMemoryWorkOrderOperationRepository } from "test/repositories/in-memory-work-order-operation-repository";
import { InMemoryMachineRepository } from "test/repositories/in-memory-machine-repository";
import { InMemoryMachineOperatorRepository } from "test/repositories/in-memory-machine-operator-repository";
import { makeMachine } from "test/factories/make-machine";
import { makeMachineOperator } from "test/factories/make-machine-operator";
import { makeWorkOrderOperation } from "test/factories/make-work-order-operation";
import { makeProductionReport } from "test/factories/make-production-report";
import { ReportProductionUseCase } from "./report-production";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { InMemorySetupReportRepository } from "test/repositories/in-memory-setup-report-repository";
import { Machine } from "../../enterprise/entities/machine";
import { MachineOperator } from "../../enterprise/entities/machine-operator";
import { WorkOrderOperation } from "../../enterprise/entities/work-order-operation";

describe("Create production report use case", () => {
  let productionReportRepository: InMemoryProductionReportRepository;
  let setupReportRepository: InMemorySetupReportRepository;
  let workOrderOperationRepository: InMemoryWorkOrderOperationRepository;
  let machineRepository: InMemoryMachineRepository;
  let machineOperatorRepository: InMemoryMachineOperatorRepository;
  let sut: ReportProductionUseCase;
  let machine: Machine;
  let machineOperator: MachineOperator;
  let workOrderOperation: WorkOrderOperation;

  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  beforeEach(async () => {
    vi.setSystemTime(new Date(2025, 0, 1, 13));

    productionReportRepository = new InMemoryProductionReportRepository();
    setupReportRepository = new InMemorySetupReportRepository();
    workOrderOperationRepository = new InMemoryWorkOrderOperationRepository(
      productionReportRepository,
      setupReportRepository
    );
    machineRepository = new InMemoryMachineRepository();
    machineOperatorRepository = new InMemoryMachineOperatorRepository();

    sut = new ReportProductionUseCase(
      workOrderOperationRepository,
      machineRepository,
      machineOperatorRepository
    );

    machineOperator = makeMachineOperator();
    workOrderOperation = makeWorkOrderOperation();
    machine = makeMachine({
      machineOperatorId: machineOperator.id,
      workOrderOperationId: workOrderOperation.id,
    });

    const startProductionReport = makeProductionReport({
      workOrderOperationId: workOrderOperation.id,
      machineId: machine.id,
      machineOperatorId: machineOperator.id,
      type: "Production start",
      partsReported: null,
      scrapsReported: null,
      elapsedTimeInSeconds: null,
    });

    workOrderOperation.productionReports.add(startProductionReport);

    machine.status = "Produzindo";
    machine.lastReportId = startProductionReport.id;
    machine.lastReportTime = startProductionReport.reportTime;

    machineOperatorRepository.items.push(machineOperator);
    workOrderOperationRepository.items.push(workOrderOperation);
    machineRepository.items.push(machine);
  });

  it("should create a production report", async () => {
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
      partsReported: productionReport.partsReported,
      scrapsReported: productionReport.scrapsReported,
    });

    const success = result.isRight();

    expect(success).toBe(true);

    if (success) {
      const newWorkOrderOperation = result.value.workOrderOperation;
      const workOrderOperationInRepository =
        workOrderOperationRepository.items[0];

      expect(newWorkOrderOperation).toEqual(workOrderOperationInRepository);

      expect(
        workOrderOperationInRepository.productionReports.currentItems
      ).toHaveLength(2);
    }
  });

  it("should register the end of setup with accurate elapsed time in seconds", async () => {
    vi.setSystemTime(new Date(2025, 0, 1, 13, 5));

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
      partsReported: productionReport.partsReported,
      scrapsReported: productionReport.scrapsReported,
    });

    const success = result.isRight();

    expect(success).toBe(true);

    if (success) {
      const workOrderOperationInRepository =
        workOrderOperationRepository.items[0];

      const productionReport =
        workOrderOperationInRepository.productionReports.getItems()[1];

      expect(productionReport.elapsedTimeInSeconds).toEqual(300);
    }
  });

  it("should return a ResourceNotFound error when the work order operation does not exists.", async () => {
    const productionReport = makeProductionReport({
      machineId: machine.id,
      machineOperatorId: machineOperator.id,
    });

    const result = await sut.execute({
      workOrderOperationId: productionReport.workOrderOperationId.toString(),
      machineId: productionReport.machineId.toString(),
      machineOperatorId: productionReport.machineOperatorId.toString(),
      reportTime: productionReport.reportTime,
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
      partsReported: productionReport.partsReported,
      scrapsReported: productionReport.scrapsReported,
    });

    const error = result.isLeft();

    expect(error).toBe(true);

    if (error) {
      expect(result.value).toBeInstanceOf(NotAllowedError);
    }
  });

  it("should return a NotAllowedError error when the machine operator is different than the actual on machine", async () => {
    const fakeMachineOperator = makeMachineOperator();
    machineOperatorRepository.items.push(fakeMachineOperator);

    const productionReport = makeProductionReport({
      workOrderOperationId: workOrderOperation.id,
      machineId: machine.id,
      machineOperatorId: fakeMachineOperator.id,
      partsReported: workOrderOperation.quantity,
    });

    const result = await sut.execute({
      workOrderOperationId: productionReport.workOrderOperationId.toString(),
      machineId: productionReport.machineId.toString(),
      machineOperatorId: productionReport.machineOperatorId.toString(),
      reportTime: productionReport.reportTime,
      partsReported: productionReport.partsReported,
      scrapsReported: productionReport.scrapsReported,
    });

    const error = result.isLeft();

    expect(error).toBe(true);

    if (error) {
      expect(result.value).toBeInstanceOf(NotAllowedError);
    }
  });

  it("should return a NotAllowedError error when the work order operation is different than the actual on machine", async () => {
    const fakeWorkOrderOperation = makeWorkOrderOperation();
    workOrderOperationRepository.items.push(fakeWorkOrderOperation);

    const productionReport = makeProductionReport({
      workOrderOperationId: fakeWorkOrderOperation.id,
      machineId: machine.id,
      machineOperatorId: machineOperator.id,
      partsReported: workOrderOperation.quantity,
    });

    const result = await sut.execute({
      workOrderOperationId: productionReport.workOrderOperationId.toString(),
      machineId: productionReport.machineId.toString(),
      machineOperatorId: productionReport.machineOperatorId.toString(),
      reportTime: productionReport.reportTime,
      partsReported: productionReport.partsReported,
      scrapsReported: productionReport.scrapsReported,
    });

    const error = result.isLeft();

    expect(error).toBe(true);

    if (error) {
      expect(result.value).toBeInstanceOf(NotAllowedError);
    }
  });

  it("should return a NotAllowedError error when the machine status is different than Produzindo", async () => {
    machineRepository.items[0].status = "Fora de produção";

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
