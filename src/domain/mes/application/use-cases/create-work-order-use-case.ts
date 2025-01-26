import { Injectable } from "@nestjs/common";
import { WorkOrder } from "../../enterprise/entities/work-order";
import { Either, left, right } from "@/core/either";
import { WorkOrderRepository } from "../repositories/work-order-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { SellOrderRepository } from "../repositories/sell-order-repository";

interface CreateWorkOrderUseCaseRequest {
  number: number;
  sellOrderId: UniqueEntityId | null;
  status: string;
  deliveryDate: Date;
  productName: string;
  productDescription: string;
  quantity: number;
  balance: number;
  comments: string;
}

type CreateWorkOrderUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    workOrder: WorkOrder;
  }
>;

@Injectable()
export class CreateWorkOrderUseCase {
  constructor(
    private sellOrderRepository: SellOrderRepository,
    private workOrderRepository: WorkOrderRepository
  ) {}

  async execute({
    number,
    sellOrderId,
    status,
    deliveryDate,
    productName,
    productDescription,
    quantity,
    comments,
  }: CreateWorkOrderUseCaseRequest): Promise<CreateWorkOrderUseCaseResponse> {
    if (sellOrderId) {
      const sellOrder = await this.sellOrderRepository.findById(
        sellOrderId.toString()
      );

      if (!sellOrder) {
        return left(new ResourceNotFoundError());
      }
    }

    const workOrder = WorkOrder.create({
      number,
      sellOrderId,
      status,
      deliveryDate,
      productName,
      productDescription,
      quantity,
      comments,
    });

    await this.workOrderRepository.create(workOrder);

    return right({ workOrder });
  }
}
