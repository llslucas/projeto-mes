import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

interface MachineOperatorProps {
  number: string;
  name: string;
  level: "Worker" | "Leader";
  sectorId: UniqueEntityId;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class MachineOperator extends Entity<MachineOperatorProps> {
  static create(
    props: Optional<MachineOperatorProps, "createdAt">,
    id?: UniqueEntityId
  ): MachineOperator {
    return new MachineOperator(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }

  get number(): string {
    return this.props.number;
  }

  get name(): string {
    return this.props.name;
  }

  get level(): string {
    return this.props.level;
  }

  get sectorId(): UniqueEntityId {
    return this.props.sectorId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | null {
    return this.props.updatedAt ?? null;
  }
}
