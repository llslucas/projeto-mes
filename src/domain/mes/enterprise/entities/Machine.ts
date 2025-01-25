import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { Injectable } from "@nestjs/common";

interface MachineProps {
  name: string;
  description: string;
  sectorId: UniqueEntityId;
  status: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

@Injectable()
export class Machine extends Entity<MachineProps> {
  static create(
    props: Optional<MachineProps, "createdAt">,
    id?: UniqueEntityId
  ): Machine {
    return new Machine(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }

  get name() {
    return this.props.name;
  }

  get description() {
    return this.props.description;
  }

  get sectorId() {
    return this.props.sectorId;
  }

  get status() {
    return this.props.status;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
