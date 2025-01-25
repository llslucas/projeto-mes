import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Injectable } from "@nestjs/common";

interface ProductionAppointmentProps {
  machineId: UniqueEntityId;
  machineOperatorId: UniqueEntityId;
  workOrderOperationId: UniqueEntityId;
  appointmentTime: Date;
  appointmentType: string;
  partsReported: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class ProductionAppointment extends Entity<ProductionAppointmentProps> {
  get machineId(): UniqueEntityId {
    return this.props.machineId;
  }

  get machineOperatorId(): UniqueEntityId {
    return this.props.machineOperatorId;
  }

  get workOrderOperationId(): UniqueEntityId {
    return this.props.workOrderOperationId;
  }

  get appointmentTime(): Date {
    return this.props.appointmentTime;
  }

  get appointmentType(): string {
    return this.props.appointmentType;
  }

  get partsReported(): number {
    return this.props.partsReported;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
