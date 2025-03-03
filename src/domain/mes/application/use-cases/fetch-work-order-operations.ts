import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { WorkOrderOperation } from "../../enterprise/entities/work-order-operation";
import { WorkOrderOperationRepository } from "../repositories/work-order-operation-repository";
import { WorkOrderRepository } from "../repositories/work-order-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

interface FetchWorkOrderOperationsUseCaseRequest {
  workOrderId: string;
}

type FetchWorkOrderOperationsUseCaseResponse = Either<
  ResourceNotFoundError,
  { workOrderOperations: WorkOrderOperation[] }
>;

@Injectable()
export class FetchWorkOrderOperationsUseCase {
  constructor(
    private workOrderRepository: WorkOrderRepository,
    private workOrderOperationRepository: WorkOrderOperationRepository
  ) {}

  async execute({
    workOrderId,
  }: FetchWorkOrderOperationsUseCaseRequest): Promise<FetchWorkOrderOperationsUseCaseResponse> {
    const workOrder = await this.workOrderRepository.findById(workOrderId);

    if (!workOrder) {
      return left(new ResourceNotFoundError("Work Order"));
    }

    const workOrderOperations =
      await this.workOrderOperationRepository.findManyByWorkOrderId(
        workOrder.id.toString()
      );

    return right({ workOrderOperations });
  }
}
