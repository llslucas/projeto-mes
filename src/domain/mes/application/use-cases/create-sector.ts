import { Injectable } from "@nestjs/common";
import { SectorRepository } from "../repositories/sector-repository";
import { Sector } from "../../enterprise/entities/sector";
import { Either, left, right } from "@/core/either";
import { SectorAlreadyExistsError } from "./errors/sector-already-exists-error";

interface CreateSectorUseCaseRequest {
  name: string;
  description: string;
}

type CreateSectorUseCaseResponse = Either<
  SectorAlreadyExistsError,
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
    const sectorExists = await this.sectorRepository.findByName(name);

    if (sectorExists) {
      return left(new SectorAlreadyExistsError());
    }

    const sector = Sector.create({ name, description });

    await this.sectorRepository.create(sector);

    return right({ sector });
  }
}
