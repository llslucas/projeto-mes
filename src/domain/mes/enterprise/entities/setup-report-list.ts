import { WatchedList } from "@/core/entities/watched-list";
import { SetupReport } from "./setup-report";

export class SetupReportList extends WatchedList<SetupReport> {
  compareItems(a: SetupReport, b: SetupReport): boolean {
    return a.id.equals(b.id);
  }
}
