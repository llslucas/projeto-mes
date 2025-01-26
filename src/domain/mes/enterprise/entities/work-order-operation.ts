import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

interface WorkOrderOperationProps {
  workOrderId: UniqueEntityId;
  number: number;
  description: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class WorkOrderOperation extends Entity<WorkOrderOperationProps> {
  get workOrderId(): UniqueEntityId {
    return this.props.workOrderId;
  }

  get number(): number {
    return this.props.number;
  }

  get description(): string {
    return this.props.description;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt;
  }
}
