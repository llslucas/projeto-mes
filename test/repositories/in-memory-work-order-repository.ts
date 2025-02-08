import { WorkOrderRepository } from "@/domain/mes/application/repositories/work-order-repository";
import { WorkOrder } from "@/domain/mes/enterprise/entities/work-order";

export class InMemoryWorkOrderRepository implements WorkOrderRepository {
  public items: WorkOrder[] = [];

  async findById(workOrderId: string): Promise<WorkOrder | null> {
    const workOrder = this.items.find((workOrder) => {
      return workOrder.id.toString() === workOrderId;
    });

    return workOrder || null;
  }

  async findByNumber(number: number): Promise<WorkOrder | null> {
    const workOrder = this.items.find(
      (workOrder) => workOrder.number === number
    );
    return workOrder || null;
  }

  async create(workOrder: WorkOrder): Promise<void> {
    this.items.push(workOrder);
  }
}
