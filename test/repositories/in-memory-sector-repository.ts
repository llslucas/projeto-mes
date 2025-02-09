import { SectorRepository } from "@/domain/mes/application/repositories/sector-repository";
import { Sector } from "@/domain/mes/enterprise/entities/sector";

export class InMemorySectorRepository implements SectorRepository {
  public items: Sector[] = [];

  async findById(sectorId: string) {
    const sector = this.items.find((sector) => {
      return sector.id.toString() === sectorId;
    });

    return sector || null;
  }

  async findByName(name: string): Promise<Sector | null> {
    const sector = this.items.find((sector) => {
      return sector.name === name;
    });

    return sector || null;
  }

  async fetchAll(search?: string) {
    if (!search || search === "") return this.items;

    return this.items.filter((item) => item.name.includes(search));
  }

  async create(sector: Sector) {
    this.items.push(sector);
  }
}
