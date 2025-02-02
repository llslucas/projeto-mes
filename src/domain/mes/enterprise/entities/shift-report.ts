import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ReportProps, Report } from "./report";
import { Optional } from "@/core/types/optional";

export type ShiftReportType = "Shift start" | "Shift end";

export interface ShiftReportProps extends ReportProps {
  type: ShiftReportType;
}

export class ShiftReport extends Report<ShiftReportProps> {
  static create(
    props: Optional<ShiftReportProps, "createdAt">,
    id?: UniqueEntityId
  ): ShiftReport {
    return new ShiftReport(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }

  get type(): ShiftReportType {
    return this.props.type;
  }
}
