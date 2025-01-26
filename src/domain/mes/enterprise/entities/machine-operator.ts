import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export type MachineOperatorLevel = "Worker" | "Leader";

export interface MachineOperatorProps {
  number: number;
  name: string;
  level: MachineOperatorLevel;
  sectorId: UniqueEntityId;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class MachineOperator extends Entity<MachineOperatorProps> {
  static create(
    props: Optional<MachineOperatorProps, "createdAt" | "level">,
    id?: UniqueEntityId
  ): MachineOperator {
    return new MachineOperator(
      {
        ...props,
        level: props.level ?? "Worker",
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }

  get number(): number {
    return this.props.number;
  }

  get name(): string {
    return this.props.name;
  }

  get level(): MachineOperatorLevel {
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
