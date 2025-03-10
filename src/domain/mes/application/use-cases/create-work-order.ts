import { Injectable } from "@nestjs/common";
import { WorkOrder } from "../../enterprise/entities/work-order";
import { Either, left, right } from "@/core/either";
import { WorkOrderRepository } from "../repositories/work-order-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { SellOrderRepository } from "../repositories/sell-order-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

interface CreateWorkOrderUseCaseRequest {
  number: number;
  sellOrderId: string | null;
  status: string;
  deliveryDate: Date;
  productName: string;
  productDescription: string;
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
      sellOrderId: sellOrderId ? new UniqueEntityId(sellOrderId) : null,
      status,
      deliveryDate,
      productName,
      productDescription,
      comments,
    });

    await this.workOrderRepository.create(workOrder);

    return right({ workOrder });
  }
}
