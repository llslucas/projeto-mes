import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { Injectable } from "@nestjs/common";

interface SellOrderProps {
  number: number;
  clientName: string;
  sellerName: string;
  status: string;
  emissionDate: Date;
  deliveryDate: Date;
  createdAt: Date;
  updatedAt?: Date | null;
}

@Injectable()
export class SellOrder extends Entity<SellOrderProps> {
  static create(
    props: Optional<SellOrderProps, "createdAt">,
    id?: UniqueEntityId
  ): SellOrder {
    return new SellOrder(
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

  get clientName(): string {
    return this.props.clientName;
  }

  get sellerName(): string {
    return this.props.sellerName;
  }

  get status(): string {
    return this.props.status;
  }

  get emissionDate(): Date {
    return this.props.emissionDate;
  }

  get deliveryDate(): Date {
    return this.props.deliveryDate;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
