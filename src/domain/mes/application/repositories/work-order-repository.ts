import { WorkOrder } from "../../enterprise/entities/work-order";

export abstract class WorkOrderRepository {
  abstract findById(workOrderId: string): Promise<WorkOrder | null>;
  abstract create(workOrder: WorkOrder): Promise<void>;
}
