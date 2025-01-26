import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  SellOrder,
  SellOrderProps,
} from "@/domain/mes/enterprise/entities/sell-order";

export function makeSellOrder(
  override: Partial<SellOrderProps> = {},
  id?: UniqueEntityId
) {
  const refDate = faker.date.soon();

  const sellOrder = SellOrder.create(
    {
      number: faker.number.int(),
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
