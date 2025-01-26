import { makeSellOrder } from "test/factories/make-sell-order";
import { InMemorySellOrderRepository } from "test/repositories/in-memory-sell-order-repository";
import { CreateSellOrderUseCase } from "./create-sell-order-use-case";

describe("Create sell order use case", () => {
  let sellOrderRepository: InMemorySellOrderRepository;
  let sut: CreateSellOrderUseCase;

  beforeEach(async () => {
    sellOrderRepository = new InMemorySellOrderRepository();
    sut = new CreateSellOrderUseCase(sellOrderRepository);
  });

  it("should create a sell order", async () => {
    const sellOrder = makeSellOrder();

    const result = await sut.execute({
      number: sellOrder.number,
      clientName: sellOrder.clientName,
      sellerName: sellOrder.sellerName,
      status: sellOrder.status,
      emissionDate: sellOrder.emissionDate,
      deliveryDate: sellOrder.deliveryDate,
    });

    const success = result.isRight();

    expect(success).toBe(true);

    if (success) {
      const sellOrderOnRepository = sellOrderRepository.items[0];
      expect(sellOrderOnRepository).toEqual(result.value.sellOrder);
    }
  });
});
