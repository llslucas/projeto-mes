import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  SellOrder,
  SellOrderProps,
} from "@/domain/mes/enterprise/entities/sell-order";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaSellOrderMapper } from "@/infra/database/prisma/mappers/prisma-sell-order-mapper";

export function makeSellOrder(
  override: Partial<SellOrderProps> = {},
  id?: UniqueEntityId
) {
  const refDate = faker.date.soon();

  const sellOrder = SellOrder.create(
    {
      number: faker.number.int({ min: 1, max: 99999 }),
      clientName: faker.company.buzzNoun(),
      sellerName: faker.person.firstName(),
      emissionDate: refDate,
      deliveryDate: faker.date.soon({ refDate }),
      ...override,
    },
    id
  );

  return sellOrder;
}

@Injectable()
export class SellOrderFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaSellOrder(
    data?: Partial<SellOrderProps>,
    id?: UniqueEntityId
  ) {
    const sellOrder = makeSellOrder(data, id);

    await this.prismaService.sellOrder.create({
      data: PrismaSellOrderMapper.toPrisma(sellOrder),
    });

    return sellOrder;
  }
}
