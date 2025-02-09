import { Prisma, SellOrder as PrismaSellOrder } from "@prisma/client";
import { SellOrder } from "@/domain/mes/enterprise/entities/sell-order";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export class PrismaSellOrderMapper {
  static toDomain(raw: PrismaSellOrder): SellOrder {
    if (!raw.id) {
      throw new Error("Invalid sell-order type");
    }

    return SellOrder.create(
      {
        clientName: raw.clientName,
        number: raw.number,
        emissionDate: raw.emissionDate,
        deliveryDate: raw.deliveryDate,
        sellerName: raw.sellerName,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        status: raw.status,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(sellOrder: SellOrder): Prisma.SellOrderUncheckedCreateInput {
    return {
      id: sellOrder.id.toString(),
      number: sellOrder.number,
      clientName: sellOrder.clientName,
      deliveryDate: sellOrder.deliveryDate,
      emissionDate: sellOrder.emissionDate,
      sellerName: sellOrder.sellerName,
      status: sellOrder.status,
    };
  }
}
