import { SectorRepository } from "@/domain/mes/application/repositories/sector-repository";
import { Sector } from "@/domain/mes/enterprise/entities/sector";
import { PrismaSectorMapper } from "../mappers/prisma-sector-mapper";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
@Injectable()
export class PrismaSectorRepository implements SectorRepository {
  constructor(private prismaService: PrismaService) {}

  async findById(sectorId: string): Promise<Sector | null> {
    const sector = await this.prismaService.sector.findUnique({
      where: { id: sectorId },
    });

    return sector ? PrismaSectorMapper.toDomain(sector) : null;
  }

  async findByName(name: string): Promise<Sector | null> {
    const sector = await this.prismaService.sector.findUnique({
      where: { name },
    });

    return sector ? PrismaSectorMapper.toDomain(sector) : null;
  }

  async fetchAll(search?: string): Promise<Sector[]> {
    const sectors = await this.prismaService.sector.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
    });

    return sectors.map(PrismaSectorMapper.toDomain);
  }

  async create(sector: Sector): Promise<void> {
    const data = PrismaSectorMapper.toPrisma(sector);

    await this.prismaService.sector.create({
      data,
    });
  }
}
