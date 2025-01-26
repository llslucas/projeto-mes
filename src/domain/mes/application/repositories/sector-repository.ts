import { Sector } from "../../enterprise/entities/Sector";

export abstract class SectorRepository {
  abstract findById(sectorId: string): Promise<Sector | null>;
  abstract create(sector: Sector): Promise<void>;
}
