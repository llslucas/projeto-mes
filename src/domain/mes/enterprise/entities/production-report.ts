import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ReportProps, Report } from "./report";
import { Optional } from "@/core/types/optional";

export type ProductionReportType =
  | "Production start"
  | "Production report"
  | "Production end";

export interface ProductionReportProps extends ReportProps {
  type: ProductionReportType;
  partsReported: number;
  scrapsReported: number;
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

  get partsReported(): number {
    return this.props.partsReported;
  }

  get scrapsReported(): number {
    return this.props.scrapsReported;
  }
}
