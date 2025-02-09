import { Injectable } from "@nestjs/common";
import { SellOrderRepository } from "../repositories/sell-order-repository";
import { SellOrder } from "../../enterprise/entities/sell-order";
import { Either, left, right } from "@/core/either";
import { SellOrderAlreadyExistsError } from "./errors/sell-order-already-exists";

interface CreateSellOrderUseCaseRequest {
  number: number;
  clientName: string;
  sellerName: string;
  status: string;
  emissionDate: Date;
  deliveryDate: Date;
}

type CreateSellOrderUseCaseResponse = Either<
  SellOrderAlreadyExistsError,
  {
    sellOrder: SellOrder;
  }
>;

@Injectable()
export class CreateSellOrderUseCase {
  constructor(private sellOrderRepository: SellOrderRepository) {}

  async execute({
    number,
    clientName,
    sellerName,
    status,
    emissionDate,
    deliveryDate,
  }: CreateSellOrderUseCaseRequest): Promise<CreateSellOrderUseCaseResponse> {
    const sellOrderExists = await this.sellOrderRepository.findByNumber(number);

    if (sellOrderExists) {
      return left(new SellOrderAlreadyExistsError());
    }

    const sellOrder = SellOrder.create({
      number,
      clientName,
      sellerName,
      status,
      emissionDate,
      deliveryDate,
    });

    await this.sellOrderRepository.create(sellOrder);

    return right({ sellOrder });
  }
}
