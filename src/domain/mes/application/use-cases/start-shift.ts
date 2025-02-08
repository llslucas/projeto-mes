import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { MachineRepository } from "../repositories/machine-repository";
import { MachineOperatorRepository } from "../repositories/machine-operator-repository";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ShiftReport } from "../../enterprise/entities/shift-report";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ShiftReportRepository } from "../repositories/shift-report-repository";

interface StartShiftUseCaseRequest {
  machineId: string;
  machineOperatorId: string;
  reportTime: Date;
}

type StartShiftUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    shiftReport: ShiftReport;
  }
>;

@Injectable()
export class StartShiftUseCase {
  constructor(
    private machineRepository: MachineRepository,
    private machineOperatorRepository: MachineOperatorRepository,
    private shiftReportRepository: ShiftReportRepository
  ) {}

  async execute({
    machineId,
    machineOperatorId,
    reportTime,
  }: StartShiftUseCaseRequest): Promise<StartShiftUseCaseResponse> {
    const machine = await this.machineRepository.findById(machineId);

    if (!machine) {
      return left(new ResourceNotFoundError("machine"));
    }

    const machineOperator =
      await this.machineOperatorRepository.findById(machineOperatorId);

    if (!machineOperator) {
      return left(new ResourceNotFoundError("machineOperator"));
    }

    const machineIsInUse =
      machine.status !== "Fora de turno" ||
      machine.workOrderOperationId ||
      machine.machineOperatorId;

    if (machineIsInUse) {
      return left(new NotAllowedError());
    }

    machine.status = "Fora de produção";
    machine.machineOperatorId = new UniqueEntityId(machineOperatorId);

    await this.machineRepository.save(machine);

    const shiftReport = ShiftReport.create({
      machineId: new UniqueEntityId(machineId),
      machineOperatorId: new UniqueEntityId(machineOperatorId),
      reportTime,
      type: "Shift start",
    });

    await this.shiftReportRepository.create(shiftReport);

    return right({ shiftReport });
  }
}
