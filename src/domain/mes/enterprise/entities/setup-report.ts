import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ReportProps, Report } from "./report";
import { Optional } from "@/core/types/optional";

export interface SetupReportProps extends ReportProps {
  setupOperatorId?: UniqueEntityId | null;
}

export class SetupReport extends Report<SetupReportProps> {
  static create(
    props: Optional<SetupReportProps, "createdAt" | "reportType">,
    id?: UniqueEntityId
  ): SetupReport {
    return new SetupReport(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        reportType: "Setup",
      },
      id
    );
  }

  get setupOperatorId(): undefined | UniqueEntityId | null {
    return this.props.setupOperatorId;
  }
}
