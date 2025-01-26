import { SellOrderRepository } from "@/domain/mes/application/repositories/sell-order-repository";
import { SellOrder } from "@/domain/mes/enterprise/entities/sell-order";

export class InMemorySellOrderRepository implements SellOrderRepository {
  public items: SellOrder[] = [];

  async findById(sellOrderId: string) {
    const sellOrder = this.items.find((sellOrder) => {
      return sellOrder.id.toString() === sellOrderId;
    });

    if (!sellOrder) {
      return null;
    }

    return sellOrder;
  }

  async create(sellOrder: SellOrder) {
    this.items.push(sellOrder);
  }
}
