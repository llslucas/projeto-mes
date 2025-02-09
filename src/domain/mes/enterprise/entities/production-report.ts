import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ReportProps, Report } from "./report";
import { Optional } from "@/core/types/optional";

export type ProductionReportType =
  | "Production start"
  | "Production report"
  | "Production end";

export interface ProductionReportProps extends ReportProps {
  type: ProductionReportType;
  partsReported?: number | null;
  scrapsReported?: number | null;
}

export class ProductionReport extends Report<ProductionReportProps> {
  static create(
    props: Optional<ProductionReportProps, "createdAt">,
    id?: UniqueEntityId
  ): ProductionReport {
    return new ProductionReport(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }

  get type(): ProductionReportType {
    return this.props.type;
  }

  get partsReported(): number | null | undefined {
    return this.props.partsReported;
  }

  get scrapsReported(): number | null | undefined {
    return this.props.scrapsReported;
  }
}
