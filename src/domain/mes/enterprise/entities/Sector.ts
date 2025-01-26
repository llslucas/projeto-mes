import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface SectorProps {
  name: string;
  description: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Sector extends Entity<SectorProps> {
  static create(
    props: Optional<SectorProps, "createdAt">,
    id?: UniqueEntityId
  ): Sector {
    return new Sector(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
