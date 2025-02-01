import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export type MachineStatus =
  | "Fora de produção"
  | "Produzindo"
  | "Em setup"
  | "Em manutenção"
  | "Fora de turno";

export interface MachineProps {
  name: string;
  description: string;
  sectorId: UniqueEntityId;
  status: MachineStatus;
  workOrderOperationId?: UniqueEntityId | null;
  machineOperatorId?: UniqueEntityId | null;
  lastReportId?: UniqueEntityId | null;
  lastReportTime?: Date | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Machine extends Entity<MachineProps> {
  static create(
    props: Optional<MachineProps, "createdAt" | "status">,
    id?: UniqueEntityId
  ): Machine {
    return new Machine(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        status: props.status ?? "Fora de produção",
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

  get workOrderOperationId() {
    return this.props.workOrderOperationId;
  }

  get machineOperatorId() {
    return this.props.machineOperatorId;
  }

  get lastReportId() {
    return this.props.lastReportId;
  }

  get lastReportTime() {
    return this.props.lastReportTime;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  set status(status: MachineStatus) {
    this.props.status = status;
  }

  set workOrderOperationId(workOrderOperationId: UniqueEntityId | null) {
    this.props.workOrderOperationId = workOrderOperationId;
  }

  set machineOperatorId(machineOperatorId: UniqueEntityId | null) {
    this.props.machineOperatorId = machineOperatorId;
  }

  set lastReportId(lastReportId: UniqueEntityId | null) {
    this.props.lastReportId = lastReportId;
  }

  set lastReportTime(lastReportTime: Date | null) {
    this.props.lastReportTime = lastReportTime;
  }
}
