import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ReportProps, Report } from "./report";
import { Optional } from "@/core/types/optional";

export type SetupReportType = "Setup start" | "Setup end";

export interface SetupReportProps extends ReportProps {
  type: SetupReportType;
  setupOperatorId?: UniqueEntityId | null;
}

export class SetupReport extends Report<SetupReportProps> {
  static create(
    props: Optional<SetupReportProps, "createdAt">,
    id?: UniqueEntityId
  ): SetupReport {
    return new SetupReport(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }

  get setupOperatorId(): undefined | UniqueEntityId | null {
    return this.props.setupOperatorId;
  }
}
