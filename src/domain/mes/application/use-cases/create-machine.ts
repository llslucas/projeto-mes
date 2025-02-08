import { Injectable } from "@nestjs/common";
import { Machine } from "../../enterprise/entities/machine";
import { Either, left, right } from "@/core/either";
import { MachineRepository } from "../repositories/machine-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { SectorRepository } from "../repositories/sector-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

interface CreateMachineUseCaseRequest {
  sectorId: UniqueEntityId;
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

    const machine = Machine.create({ name, description, sectorId });

    await this.machineRepository.create(machine);

    return right({ machine });
  }
}
