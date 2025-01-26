import { WorkOrderOperationRepository } from "@/domain/mes/application/repositories/work-order-operation-repository";
import { WorkOrderOperation } from "@/domain/mes/enterprise/entities/work-order-operation";

export class InMemoryWorkOrderOperationRepository
  implements WorkOrderOperationRepository
{
  public items: WorkOrderOperation[] = [];

  async findById(workOrderOperationId: string) {
    const workOrderOperation = this.items.find((workOrderOperation) => {
      return workOrderOperation.id.toString() === workOrderOperationId;
    });

    if (!workOrderOperation) {
      return null;
    }

    return workOrderOperation;
  }

  async create(workOrderOperation: WorkOrderOperation) {
    this.items.push(workOrderOperation);
  }
}
