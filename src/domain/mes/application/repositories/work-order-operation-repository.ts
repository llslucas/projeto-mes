import { WorkOrderOperation } from "../../enterprise/entities/work-order-operation";

export abstract class WorkOrderOperationRepository {
  abstract findById(
    workOrderOperationId: string
  ): Promise<WorkOrderOperation | null>;
  abstract create(workOrderOperation: WorkOrderOperation): Promise<void>;
}
