import { Either, right } from "@/core/either";
import { Machine } from "../../enterprise/entities/machine";
import { Injectable } from "@nestjs/common";
import { MachineRepository } from "../repositories/machine-repository";

interface FetchMachinesUseCaseRequest {
  sectorId: string;
}

type FetchMachinesUseCaseResponse = Either<null, { machines: Machine[] }>;

@Injectable()
export class FetchMachinesUseCase {
  constructor(private machineRepository: MachineRepository) {}

  async execute({
    sectorId,
  }: FetchMachinesUseCaseRequest): Promise<FetchMachinesUseCaseResponse> {
    const machines = await this.machineRepository.findBySectorId(sectorId);

    return right({ machines });
  }
}
