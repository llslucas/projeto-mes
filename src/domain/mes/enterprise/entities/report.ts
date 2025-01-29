import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

type ReportType = "Production" | "Setup";

export interface ReportProps {
  machineId: UniqueEntityId;
  machineOperatorId: UniqueEntityId;
  workOrderOperationId: UniqueEntityId;
  reportType: ReportType;
  reportTime: Date;
  elapsedTimeInSeconds: number;
  createdAt: Date;
  updatedAt?: Date | null;
}

export abstract class Report<Props extends ReportProps> extends Entity<Props> {
  get machineId(): UniqueEntityId {
    return this.props.machineId;
  }

  get machineOperatorId(): UniqueEntityId {
    return this.props.machineOperatorId;
  }

  get workOrderOperationId(): UniqueEntityId {
    return this.props.workOrderOperationId;
  }

  get reportType(): ReportType {
    return this.props.reportType;
  }

  get reportTime(): Date {
    return this.props.reportTime;
  }

  get elapsedTimeInSeconds(): number {
    return this.props.elapsedTimeInSeconds;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt;
  }
}
