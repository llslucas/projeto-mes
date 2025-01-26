import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Injectable } from "@nestjs/common";

interface WorkOrderOperationProps {
  number: number;
  description: string;
  workOrderId: UniqueEntityId;
  sectorId: UniqueEntityId;
  createdAt: Date;
  updatedAt?: Date | null;
}

@Injectable()
export class WorkOrderOperation extends Entity<WorkOrderOperationProps> {
  get number(): number {
    return this.props.number;
  }

  get description(): string {
    return this.props.description;
  }

  get workOrderId(): UniqueEntityId {
    return this.props.workOrderId;
  }

  get sectorId(): UniqueEntityId {
    return this.props.sectorId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt;
  }
}
