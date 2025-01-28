import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { ProductionReportList } from "./production-report-list";

export interface WorkOrderOperationProps {
  workOrderId: UniqueEntityId;
  number: number;
  description: string;
  quantity: number;
  balance: number;
  productionReports: ProductionReportList;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class WorkOrderOperation extends AggregateRoot<WorkOrderOperationProps> {
  static create(
    props: Optional<
      WorkOrderOperationProps,
      "createdAt" | "balance" | "productionReports"
    >,
    id?: UniqueEntityId
  ): WorkOrderOperation {
    return new WorkOrderOperation(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        balance: props.balance ?? props.quantity,
        productionReports:
          props.productionReports ?? new ProductionReportList(),
      },
      id
    );
  }

  get workOrderId(): UniqueEntityId {
    return this.props.workOrderId;
  }

  get number(): number {
    return this.props.number;
  }

  get description(): string {
    return this.props.description;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get balance(): number {
    return this.props.balance;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt;
  }
}
