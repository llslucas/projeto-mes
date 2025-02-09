import { SellOrderRepository } from "@/domain/mes/application/repositories/sell-order-repository";
import { SellOrder } from "@/domain/mes/enterprise/entities/sell-order";

export class InMemorySellOrderRepository implements SellOrderRepository {
  public items: SellOrder[] = [];

  async findById(sellOrderId: string): Promise<SellOrder | null> {
    const sellOrder = this.items.find((sellOrder) => {
      return sellOrder.id.toString() === sellOrderId;
    });

    return sellOrder || null;
  }

  async findByNumber(sellOrderNumber: number): Promise<SellOrder | null> {
    const sellOrder = this.items.find((sellOrder) => {
      return sellOrder.number === sellOrderNumber;
    });
    return sellOrder || null;
  }

  async create(sellOrder: SellOrder): Promise<void> {
    this.items.push(sellOrder);
  }
}
