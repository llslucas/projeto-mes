import { SellOrder } from "../../enterprise/entities/sell-order";

export abstract class SellOrderRepository {
  abstract findById(sellOrderId: string): Promise<SellOrder | null>;
  abstract create(sellOrder: SellOrder): Promise<void>;
}
