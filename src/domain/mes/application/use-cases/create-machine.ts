import { Injectable } from "@nestjs/common";
import { Machine } from "../../enterprise/entities/machine";
import { Either, left, right } from "@/core/either";
import { MachineRepository } from "../repositories/machine-repository";
import { SectorRepository } from "../repositories/sector-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

interface CreateMachineUseCaseRequest {
  sectorId: string;
  name: string;
  description: string;
}

type CreateMachineUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    machine: Machine;
  }
>;

@Injectable()
export class CreateMachineUseCase {
  constructor(
    private sectorRepository: SectorRepository,
    private machineRepository: MachineRepository
  ) {}

  async execute({
    name,
    description,
    sectorId,
  }: CreateMachineUseCaseRequest): Promise<CreateMachineUseCaseResponse> {
    const sector = await this.sectorRepository.findById(sectorId.toString());

    if (!sector) {
      return left(new ResourceNotFoundError());
    }

    const machine = Machine.create({
      name,
      description,
      sectorId: new UniqueEntityId(sectorId),
    });

    await this.machineRepository.create(machine);

    return right({ machine });
  }
}
