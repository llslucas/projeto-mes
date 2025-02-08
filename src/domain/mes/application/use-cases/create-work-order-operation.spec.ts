import { makeWorkOrder } from "test/factories/make-work-order";
import { InMemoryWorkOrderRepository } from "test/repositories/in-memory-work-order-repository";
import { InMemoryWorkOrderOperationRepository } from "test/repositories/in-memory-work-order-operation-repository";
import { CreateWorkOrderOperationUseCase } from "./create-work-order-operation";
import { makeWorkOrderOperation } from "test/factories/make-work-order-operation";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { InMemoryProductionReportRepository } from "test/repositories/in-memory-production-report-repository";
import { InMemorySetupReportRepository } from "test/repositories/in-memory-setup-report-repository";

describe("Create work order operation use case", () => {
  let workOrderRepository: InMemoryWorkOrderRepository;
  let productionReportRepository: InMemoryProductionReportRepository;
  let setupReportRepository: InMemorySetupReportRepository;
  let workOrderOperationRepository: InMemoryWorkOrderOperationRepository;
  let sut: CreateWorkOrderOperationUseCase;

  beforeEach(async () => {
    workOrderRepository = new InMemoryWorkOrderRepository();
    productionReportRepository = new InMemoryProductionReportRepository();
    setupReportRepository = new InMemorySetupReportRepository();
    workOrderOperationRepository = new InMemoryWorkOrderOperationRepository(
      productionReportRepository,
      setupReportRepository
    );
    sut = new CreateWorkOrderOperationUseCase(
      workOrderRepository,
      workOrderOperationRepository
    );
  });

  it("should be able to create a work order with a sell order", async () => {
    const workOrder = makeWorkOrder();

    workOrderRepository.items.push(workOrder);

    const workOrderOperation = makeWorkOrderOperation({
      workOrderId: workOrder.id,
    });

    const result = await sut.execute({
      workOrderId: workOrderOperation.workOrderId.toString(),
      number: workOrderOperation.number,
      description: workOrderOperation.description,
      quantity: workOrderOperation.quantity,
      balance: workOrderOperation.balance,
    });

    const success = result.isRight();

    expect(success).toBe(true);

    if (success) {
      const workOrderOperationOnRepository =
        workOrderOperationRepository.items[0];
      expect(workOrderOperationOnRepository).toEqual(
        result.value.workOrderOperation
      );
    }
  });

  it("should return a Resource not found error upon creation with an invalid work order", async () => {
    const workOrderOperation = makeWorkOrderOperation({
      workOrderId: new UniqueEntityId("Invalid Work Order ID"),
    });

    const result = await sut.execute({
      workOrderId: workOrderOperation.workOrderId.toString(),
      number: workOrderOperation.number,
      description: workOrderOperation.description,
      quantity: workOrderOperation.quantity,
      balance: workOrderOperation.balance,
    });

    const error = result.isLeft();

    expect(error).toBe(true);

    if (error) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });
});
