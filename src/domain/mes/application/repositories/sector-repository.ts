import { Sector } from "../../enterprise/entities/sector";

export abstract class SectorRepository {
  abstract findById(sectorId: string): Promise<Sector | null>;
  abstract findByName(name: string): Promise<Sector | null>;
  abstract fetchAll(search?: string): Promise<Sector[]>;
  abstract create(sector: Sector): Promise<void>;
}
