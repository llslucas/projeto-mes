import { SectorRepository } from "@/domain/mes/application/repositories/sector-repository";
import { Sector } from "@/domain/mes/enterprise/entities/Sector";

export class InMemorySectorRepository implements SectorRepository {
  public items: Sector[] = [];

  async create(sector: Sector) {
    this.items.push(sector);
  }
}
