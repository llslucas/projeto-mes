import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

interface ProductionReportProps {
  machineId: UniqueEntityId;
  machineOperatorId: UniqueEntityId;
  workOrderOperationId: UniqueEntityId;
  appointmentTime: Date;
  appointmentType: string;
  partsReported: number;
  scrapsReported: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ProductionReport extends Entity<ProductionReportProps> {
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
