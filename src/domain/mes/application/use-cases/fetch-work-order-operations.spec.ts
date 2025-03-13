import { makeWorkOrder } from "test/factories/make-work-order";
import { InMemoryWorkOrderRepository } from "test/repositories/in-memory-work-order-repository";
import { InMemoryWorkOrderOperationRepository } from "test/repositories/in-memory-work-order-operation-repository";
import { makeWorkOrderOperation } from "test/factories/make-work-order-operation";
import { InMemoryProductionReportRepository } from "test/repositories/in-memory-production-report-repository";
import { InMemorySetupReportRepository } from "test/repositories/in-memory-setup-report-repository";
import { FetchWorkOrderOperationsUseCase } from "./fetch-work-order-operations";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

describe("Fetch work order operations use case", () => {
  let workOrderRepository: InMemoryWorkOrderRepository;
  let productionReportRepository: InMemoryProductionReportRepository;
  let setupReportRepository: InMemorySetupReportRepository;
  let workOrderOperationRepository: InMemoryWorkOrderOperationRepository;
  let sut: FetchWorkOrderOperationsUseCase;

  beforeEach(async () => {
    workOrderRepository = new InMemoryWorkOrderRepository();
    productionReportRepository = new InMemoryProductionReportRepository();
    setupReportRepository = new InMemorySetupReportRepository();
    workOrderOperationRepository = new InMemoryWorkOrderOperationRepository(
      productionReportRepository,
      setupReportRepository
    );
    sut = new FetchWorkOrderOperationsUseCase(
      workOrderRepository,
      workOrderOperationRepository
    );
  });

  it("should be able to fetch an specific work order operations", async () => {
    const workOrder = makeWorkOrder();

    workOrderRepository.items.push(workOrder);

    const workOrderOperation = makeWorkOrderOperation({
      workOrderId: workOrder.id,
    });

    const workOrderOperation2 = makeWorkOrderOperation({
      workOrderId: workOrder.id,
    });

    workOrderOperationRepository.items.push(
      workOrderOperation,
      workOrderOperation2
    );

    const result = await sut.execute({
      workOrderId: workOrder.id.toString(),
    });

    const success = result.isRight();

    expect(success).toBe(true);

    if (success) {
      expect(result.value.workOrderOperations).toEqual([
        workOrderOperation,
        workOrderOperation2,
      ]);
    }
  });

  it("should be able to fetch an specific work order operations", async () => {
    const workOrderOperation = makeWorkOrderOperation();
    workOrderOperationRepository.items.push(workOrderOperation);

    const result = await sut.execute({
      workOrderId: "Teste",
    });

    const error = result.isLeft();

    expect(error).toBe(true);

    if (error) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });
});
