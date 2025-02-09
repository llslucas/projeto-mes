import { Injectable } from "@nestjs/common";
import {
  MachineOperator,
  MachineOperatorLevel,
} from "../../enterprise/entities/machine-operator";
import { Either, left, right } from "@/core/either";
import { MachineOperatorRepository } from "../repositories/machine-operator-repository";
import { SectorRepository } from "../repositories/sector-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { MachineOperatorAlreadyExistsError } from "./errors/machine-operator-already-exists-error";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

interface CreateMachineOperatorUseCaseRequest {
  sectorId: string;
  number: number;
  name: string;
  level: MachineOperatorLevel;
}

type CreateMachineOperatorUseCaseResponse = Either<
  ResourceNotFoundError | MachineOperatorAlreadyExistsError,
  {
    machineOperator: MachineOperator;
  }
>;

@Injectable()
export class CreateMachineOperatorUseCase {
  constructor(
    private sectorRepository: SectorRepository,
    private machineOperatorRepository: MachineOperatorRepository
  ) {}

  async execute({
    sectorId,
    number,
    name,
    level,
  }: CreateMachineOperatorUseCaseRequest): Promise<CreateMachineOperatorUseCaseResponse> {
    const sector = await this.sectorRepository.findById(sectorId.toString());

    if (!sector) {
      return left(new ResourceNotFoundError());
    }

    const machineOperatorAlreadyExists =
      await this.machineOperatorRepository.findByNumber(number);

    if (machineOperatorAlreadyExists) {
      return left(new MachineOperatorAlreadyExistsError());
    }

    const machineOperator = MachineOperator.create({
      sectorId: new UniqueEntityId(sectorId),
      number,
      name,
      level,
    });

    await this.machineOperatorRepository.create(machineOperator);

    return right({ machineOperator });
  }
}
