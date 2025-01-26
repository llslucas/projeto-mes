import { Sector } from "../../enterprise/entities/Sector";

export abstract class SectorRepository {
  abstract create(sector: Sector): Promise<void>;
}
