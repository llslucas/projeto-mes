import { ProductionReportRepository } from "@/domain/mes/application/repositories/production-report-repository";
import { SetupReportRepository } from "@/domain/mes/application/repositories/setup-report-repository";
import { WorkOrderOperationRepository } from "@/domain/mes/application/repositories/work-order-operation-repository";
import { WorkOrderOperation } from "@/domain/mes/enterprise/entities/work-order-operation";

export class InMemoryWorkOrderOperationRepository
  implements WorkOrderOperationRepository
{
  constructor(
    private productionReportRepository: ProductionReportRepository,
    private setupReportRepository: SetupReportRepository
  ) {}

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

  async save(workOrderOperation: WorkOrderOperation): Promise<void> {
    const index = this.items.findIndex((item) =>
      item.equals(workOrderOperation)
    );

    this.items[index] = workOrderOperation;

    const productionReports =
      workOrderOperation.productionReports.getNewItems();

    const setupReports = workOrderOperation.setupReports.getNewItems();

    if (productionReports.length > 0)
      await this.productionReportRepository.createMany(productionReports);

    if (setupReports.length > 0)
      await this.setupReportRepository.createMany(setupReports);
  }
}
