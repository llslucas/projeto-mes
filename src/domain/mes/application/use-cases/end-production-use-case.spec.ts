import { InMemoryProductionReportRepository } from "test/repositories/in-memory-production-report-repository";
import { InMemoryWorkOrderOperationRepository } from "test/repositories/in-memory-work-order-operation-repository";
import { InMemoryMachineRepository } from "test/repositories/in-memory-machine-repository";
import { InMemoryMachineOperatorRepository } from "test/repositories/in-memory-machine-operator-repository";
import { makeMachine } from "test/factories/make-machine";
import { makeMachineOperator } from "test/factories/make-machine-operator";
import { makeWorkOrderOperation } from "test/factories/make-work-order-operation";
import { MachineOperator } from "../../enterprise/entities/machine-operator";
import { WorkOrderOperation } from "../../enterprise/entities/work-order-operation";
import { Machine } from "../../enterprise/entities/machine";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { InMemorySetupReportRepository } from "test/repositories/in-memory-setup-report-repository";
import { makeProductionReport } from "test/factories/make-production-report";
import { EndProductionUseCase } from "./end-production-use-case";

describe("End production use case", () => {
  let productionReportRepository: InMemoryProductionReportRepository;
  let setupReportRepository: InMemorySetupReportRepository;
  let workOrderOperationRepository: InMemoryWorkOrderOperationRepository;
  let machineRepository: InMemoryMachineRepository;
  let machineOperatorRepository: InMemoryMachineOperatorRepository;
  let machineOperator: MachineOperator;
  let workOrderOperation: WorkOrderOperation;
  let machine: Machine;
  let sut: EndProductionUseCase;

  beforeEach(async () => {
    productionReportRepository = new InMemoryProductionReportRepository();
    setupReportRepository = new InMemorySetupReportRepository();
    workOrderOperationRepository = new InMemoryWorkOrderOperationRepository(
      productionReportRepository,
      setupReportRepository
    );
    machineRepository = new InMemoryMachineRepository();
    machineOperatorRepository = new InMemoryMachineOperatorRepository();

    sut = new EndProductionUseCase(
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

    workOrderOperation.balance = 0;
    machine.status = "Produzindo";

    machineOperatorRepository.items.push(machineOperator);
    workOrderOperationRepository.items.push(workOrderOperation);
    machineRepository.items.push(machine);
  });

  it("should finish an ongoing production", async () => {
    const productionReport = makeProductionReport({
      workOrderOperationId: workOrderOperation.id,
      machineId: machine.id,
      machineOperatorId: machineOperator.id,
    });

    const result = await sut.execute({
      workOrderOperationId: productionReport.workOrderOperationId.toString(),
      machineId: productionReport.machineId.toString(),
      machineOperatorId: productionReport.machineOperatorId.toString(),
      reportTime: productionReport.reportTime,
    });

    const success = result.isRight();

    expect(success).toBe(true);

    if (success) {
      const newWorkOrderOperation = result.value.workOrderOperation;
      const workOrderOperationInRepository =
        workOrderOperationRepository.items[0];
      const machineInRepository = machineRepository.items[0];

      expect(newWorkOrderOperation).toEqual(workOrderOperationInRepository);
      expect(machineInRepository.status).toBe("Fora de produção");
      expect(machineInRepository.workOrderOperationId).toBeNull();
      expect(machineInRepository.lastReportId).toBeNull();
      expect(machineInRepository.lastReportTime).toBeNull();
    }
  });

  it("should return a resource not found error if the work order operation did not exists", async () => {
    const productionReport = makeProductionReport({
      workOrderOperationId: new UniqueEntityId("Fake work order operation"),
      machineId: machine.id,
      machineOperatorId: machineOperator.id,
    });

    const result = await sut.execute({
      workOrderOperationId: productionReport.workOrderOperationId.toString(),
      machineId: productionReport.machineId.toString(),
      machineOperatorId: productionReport.machineOperatorId.toString(),
      reportTime: productionReport.reportTime,
    });

    const error = result.isLeft();

    expect(error).toBe(true);

    if (error) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("should return a resource not found error if the machine operator did not exists", async () => {
    const productionReport = makeProductionReport({
      workOrderOperationId: workOrderOperation.id,
      machineId: machine.id,
      machineOperatorId: new UniqueEntityId("Fake machine operator"),
    });

    const result = await sut.execute({
      workOrderOperationId: productionReport.workOrderOperationId.toString(),
      machineId: productionReport.machineId.toString(),
      machineOperatorId: productionReport.machineOperatorId.toString(),
      reportTime: productionReport.reportTime,
    });

    const error = result.isLeft();

    expect(error).toBe(true);

    if (error) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("should return a resource not found error if the machine did not exists", async () => {
    const productionReport = makeProductionReport({
      workOrderOperationId: workOrderOperation.id,
      machineId: new UniqueEntityId("Fake machine"),
      machineOperatorId: machineOperator.id,
    });

    const result = await sut.execute({
      workOrderOperationId: productionReport.workOrderOperationId.toString(),
      machineId: productionReport.machineId.toString(),
      machineOperatorId: productionReport.machineOperatorId.toString(),
      reportTime: productionReport.reportTime,
    });

    const error = result.isLeft();

    expect(error).toBe(true);

    if (error) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("should return a not allowed error if the machine status is different than Produzindo", async () => {
    machineRepository.items[0].status = "Fora de produção";

    const productionReport = makeProductionReport({
      workOrderOperationId: workOrderOperation.id,
      machineId: machine.id,
      machineOperatorId: machineOperator.id,
    });

    const result = await sut.execute({
      workOrderOperationId: productionReport.workOrderOperationId.toString(),
      machineId: productionReport.machineId.toString(),
      machineOperatorId: productionReport.machineOperatorId.toString(),
      reportTime: productionReport.reportTime,
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

    const productionReport = makeProductionReport({
      workOrderOperationId: workOrderOperation.id,
      machineId: machine.id,
      machineOperatorId: fakeMachineOperator.id,
    });

    const result = await sut.execute({
      workOrderOperationId: productionReport.workOrderOperationId.toString(),
      machineId: productionReport.machineId.toString(),
      machineOperatorId: productionReport.machineOperatorId.toString(),
      reportTime: productionReport.reportTime,
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

    const productionReport = makeProductionReport({
      workOrderOperationId: fakeWorkOrderOperation.id,
      machineId: machine.id,
      machineOperatorId: machineOperator.id,
    });

    const result = await sut.execute({
      workOrderOperationId: productionReport.workOrderOperationId.toString(),
      machineId: productionReport.machineId.toString(),
      machineOperatorId: productionReport.machineOperatorId.toString(),
      reportTime: productionReport.reportTime,
    });

    const error = result.isLeft();

    expect(error).toBe(true);

    if (error) {
      expect(result.value).toBeInstanceOf(NotAllowedError);
    }
  });

  it("should return a not allowed error if the work order operation is different than the actual", async () => {
    workOrderOperationRepository.items[0].balance = 1;

    const productionReport = makeProductionReport({
      workOrderOperationId: workOrderOperation.id,
      machineId: machine.id,
      machineOperatorId: machineOperator.id,
    });

    const result = await sut.execute({
      workOrderOperationId: productionReport.workOrderOperationId.toString(),
      machineId: productionReport.machineId.toString(),
      machineOperatorId: productionReport.machineOperatorId.toString(),
      reportTime: productionReport.reportTime,
    });

    const error = result.isLeft();

    expect(error).toBe(true);

    if (error) {
      expect(result.value).toBeInstanceOf(NotAllowedError);
    }
  });
});
