import { WorkOrderRepository } from "@/domain/mes/application/repositories/work-order-repository";
import { WorkOrder } from "@/domain/mes/enterprise/entities/work-order";

export class InMemoryWorkOrderRepository implements WorkOrderRepository {
  public items: WorkOrder[] = [];

  async findById(workOrderId: string) {
    const workOrder = this.items.find((workOrder) => {
      return workOrder.id.toString() === workOrderId;
    });

    if (!workOrder) {
      return null;
    }

    return workOrder;
  }

  async create(workOrder: WorkOrder) {
    this.items.push(workOrder);
  }
}
