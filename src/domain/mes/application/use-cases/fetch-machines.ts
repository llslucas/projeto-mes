import { Either, right } from "@/core/either";
import { Machine } from "../../enterprise/entities/machine";
import { Injectable } from "@nestjs/common";
import { MachineRepository } from "../repositories/machine-repository";
import { MachineOperatorRepository } from "../repositories/machine-operator-repository";

interface FetchMachinesUseCaseRequest {
  machineOperatorId: string;
}

type FetchMachinesUseCaseResponse = Either<null, { machines: Machine[] }>;

@Injectable()
export class FetchMachinesUseCase {
  constructor(
    private machineOperatorRepository: MachineOperatorRepository,
    private machineRepository: MachineRepository
  ) {}

  async execute({
    machineOperatorId,
  }: FetchMachinesUseCaseRequest): Promise<FetchMachinesUseCaseResponse> {
    const operator =
      await this.machineOperatorRepository.findById(machineOperatorId);

    const machines = await this.machineRepository.findManyBySectorId(
      operator.sectorId.toString()
    );

    return right({ machines });
  }
}
