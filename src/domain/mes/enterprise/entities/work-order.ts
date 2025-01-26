import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { Injectable } from "@nestjs/common";

interface WorkOrderProps {
  number: number;
  sellOrderId: UniqueEntityId;
  type: string;
  status: string;
  deliveryDate: Date;
  productName: string;
  productDescription: string;
  quantity: number;
  balance: number;
  comments: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

@Injectable()
export class WorkOrder extends Entity<WorkOrderProps> {
  static create(
    props: Optional<WorkOrderProps, "createdAt">,
    id?: UniqueEntityId
  ): WorkOrder {
    return new WorkOrder(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }

  get number(): number {
    return this.props.number;
  }

  get type(): string {
    return this.props.type;
  }

  get status(): string {
    return this.props.status;
  }

  get deliveryDate(): Date {
    return this.props.deliveryDate;
  }

  get productName(): string {
    return this.props.productName;
  }

  get productDescription(): string {
    return this.props.productDescription;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get balance(): number {
    return this.props.balance;
  }

  get comments(): string {
    return this.props.comments;
  }
}
