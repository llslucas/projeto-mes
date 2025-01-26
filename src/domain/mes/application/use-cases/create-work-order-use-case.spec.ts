import { makeWorkOrder } from "test/factories/make-work-order";
import { InMemoryWorkOrderRepository } from "test/repositories/in-memory-work-order-repository";
import { CreateWorkOrderUseCase } from "./create-work-order-use-case";
import { InMemorySellOrderRepository } from "test/repositories/in-memory-sell-order-repository";
import { makeSellOrder } from "test/factories/make-sell-order";

describe("Create work order use case", () => {
  let sellOrderRepository: InMemorySellOrderRepository;
  let workOrderRepository: InMemoryWorkOrderRepository;
  let sut: CreateWorkOrderUseCase;

  beforeEach(async () => {
    sellOrderRepository = new InMemorySellOrderRepository();
    workOrderRepository = new InMemoryWorkOrderRepository();
    sut = new CreateWorkOrderUseCase(sellOrderRepository, workOrderRepository);
  });

  it("should be able to create a work order with a sell order", async () => {
    const sellOrder = makeSellOrder();

    sellOrderRepository.items.push(sellOrder);

    const workOrder = makeWorkOrder();

    const result = await sut.execute({
      sellOrderId: sellOrder.id,
      number: workOrder.number,
      productName: workOrder.productName,
      productDescription: workOrder.productDescription,
      quantity: workOrder.quantity,
      balance: workOrder.balance,
      status: workOrder.status,
      comments: workOrder.comments,
      deliveryDate: workOrder.deliveryDate,
    });

    const success = result.isRight();

    expect(success).toBe(true);

    if (success) {
      const workOrderOnRepository = workOrderRepository.items[0];
      expect(workOrderOnRepository).toEqual(result.value.workOrder);
    }
  });

  it("should be able to create a work order without a sell order", async () => {
    const workOrder = makeWorkOrder();

    const result = await sut.execute({
      sellOrderId: null,
      number: workOrder.number,
      productName: workOrder.productName,
      productDescription: workOrder.productDescription,
      quantity: workOrder.quantity,
      balance: workOrder.balance,
      status: workOrder.status,
      comments: workOrder.comments,
      deliveryDate: workOrder.deliveryDate,
    });

    const success = result.isRight();

    expect(success).toBe(true);

    if (success) {
      const workOrderOnRepository = workOrderRepository.items[0];
      expect(workOrderOnRepository).toEqual(result.value.workOrder);
    }
  });
});
