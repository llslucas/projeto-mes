import { Injectable } from "@nestjs/common";
import { WorkOrderOperation } from "../../enterprise/entities/work-order-operation";
import { Either, left, right } from "@/core/either";
import { WorkOrderOperationRepository } from "../repositories/work-order-operation-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { WorkOrderRepository } from "../repositories/work-order-repository";

interface CreateWorkOrderOperationUseCaseRequest {
  workOrderId: UniqueEntityId;
  number: number;
  description: string;
}

type CreateWorkOrderOperationUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    workOrderOperation: WorkOrderOperation;
  }
>;

@Injectable()
export class CreateWorkOrderOperationUseCase {
  constructor(
    private workOrderRepository: WorkOrderRepository,
    private workOrderOperationRepository: WorkOrderOperationRepository
  ) {}

  async execute({
    workOrderId,
    number,
    description,
  }: CreateWorkOrderOperationUseCaseRequest): Promise<CreateWorkOrderOperationUseCaseResponse> {
    const workOrder = await this.workOrderRepository.findById(
      workOrderId.toString()
    );

    if (!workOrder) {
      return left(new ResourceNotFoundError());
    }

    const workOrderOperation = WorkOrderOperation.create({
      workOrderId,
      number,
      description,
    });

    await this.workOrderOperationRepository.create(workOrderOperation);

    return right({ workOrderOperation });
  }
}
