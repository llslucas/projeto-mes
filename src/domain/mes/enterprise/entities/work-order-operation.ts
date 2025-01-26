import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface WorkOrderOperationProps {
  workOrderId: UniqueEntityId;
  number: number;
  description: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class WorkOrderOperation extends Entity<WorkOrderOperationProps> {
  static create(
    props: Optional<WorkOrderOperationProps, "createdAt">,
    id?: UniqueEntityId
  ): WorkOrderOperation {
    return new WorkOrderOperation(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
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

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt;
  }
}
