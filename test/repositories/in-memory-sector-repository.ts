import { SectorRepository } from "@/domain/mes/application/repositories/sector-repository";
import { Sector } from "@/domain/mes/enterprise/entities/sector";

export class InMemorySectorRepository implements SectorRepository {
  public items: Sector[] = [];

  async findById(sectorId: string) {
    const question = this.items.find((sector) => {
      return sector.id.toString() === sectorId;
    });

    if (!question) {
      return null;
    }

    return question;
  }

  async create(sector: Sector) {
    this.items.push(sector);
  }
}
