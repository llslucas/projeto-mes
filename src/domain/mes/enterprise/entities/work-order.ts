import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { Injectable } from "@nestjs/common";

export interface WorkOrderProps {
  number: number;
  sellOrderId?: UniqueEntityId | null;
  status: string;
  deliveryDate: Date;
  productName: string;
  productDescription: string;
  quantity: number;
  balance: number;
  comments?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

@Injectable()
export class WorkOrder extends Entity<WorkOrderProps> {
  static create(
    props: Optional<WorkOrderProps, "createdAt" | "balance" | "status">,
    id?: UniqueEntityId
  ): WorkOrder {
    return new WorkOrder(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        balance: props.quantity,
        status: props.status ?? "Aberto",
      },
      id
    );
  }

  get number(): number {
    return this.props.number;
  }

  get sellOrderId(): UniqueEntityId | null | undefined {
    return this.props.sellOrderId;
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

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt;
  }
}
