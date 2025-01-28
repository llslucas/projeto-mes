import { WatchedList } from "@/core/entities/watched-list";
import { ProductionReport } from "./production-report";

export class ProductionReportList extends WatchedList<ProductionReport> {
  compareItems(a: ProductionReport, b: ProductionReport): boolean {
    return a.id.equals(b.id);
  }
}
