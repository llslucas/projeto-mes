import { WorkOrderOperation } from "../../enterprise/entities/work-order-operation";

export abstract class WorkOrderOperationRepository {
  abstract findById(
    workOrderOperationId: string
  ): Promise<WorkOrderOperation | null>;

  abstract findManyByWorkOrderId(
    workOrderId: string
  ): Promise<WorkOrderOperation[] | null>;

  abstract create(workOrderOperation: WorkOrderOperation): Promise<void>;

  abstract save(workOrderOperation: WorkOrderOperation): Promise<void>;
}
