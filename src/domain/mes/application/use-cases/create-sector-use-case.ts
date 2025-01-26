import { Injectable } from "@nestjs/common";
import { SectorRepository } from "../repositories/sector-repository";
import { Sector } from "../../enterprise/entities/Sector";
import { Either, right } from "@/core/either";

interface CreateSectorUseCaseRequest {
  name: string;
  description: string;
}

type CreateSectorUseCaseResponse = Either<
  null,
  {
    sector: Sector;
  }
>;

@Injectable()
export class CreateSectorUseCase {
  constructor(private sectorRepository: SectorRepository) {}

  async execute({
    name,
    description,
  }: CreateSectorUseCaseRequest): Promise<CreateSectorUseCaseResponse> {
    const sector = Sector.create({ name, description });

    await this.sectorRepository.create(sector);

    return right({ sector });
  }
}
