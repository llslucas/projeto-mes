import { SellOrder } from "../../enterprise/entities/sell-order";

export abstract class SellOrderRepository {
  abstract findById(sectorId: string): Promise<SellOrder | null>;
  abstract create(sector: SellOrder): Promise<void>;
}
