import { Either, right } from "@/core/either";
import { Sector } from "../../enterprise/entities/sector";
import { Injectable } from "@nestjs/common";
import { SectorRepository } from "../repositories/sector-repository";

interface FetchSectorsUseCaseRequest {
  search?: string;
}

type FetchSectorsUseCaseResponse = Either<null, { sectors: Sector[] }>;

@Injectable()
export class FetchSectorsUseCase {
  constructor(private sectorRepository: SectorRepository) {}

  async execute({
    search,
  }: FetchSectorsUseCaseRequest = {}): Promise<FetchSectorsUseCaseResponse> {
    const sectors = await this.sectorRepository.fetchByName(search);

    return right({ sectors });
  }
}
