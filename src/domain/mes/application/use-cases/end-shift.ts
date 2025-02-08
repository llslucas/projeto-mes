import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { MachineRepository } from "../repositories/machine-repository";
import { MachineOperatorRepository } from "../repositories/machine-operator-repository";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ShiftReport } from "../../enterprise/entities/shift-report";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ShiftReportRepository } from "../repositories/shift-report-repository";

interface EndShiftUseCaseRequest {
  machineId: string;
  machineOperatorId: string;
  reportTime: Date;
}

type EndShiftUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    shiftReport: ShiftReport;
  }
>;

@Injectable()
export class EndShiftUseCase {
  constructor(
    private machineRepository: MachineRepository,
    private machineOperatorRepository: MachineOperatorRepository,
    private shiftReportRepository: ShiftReportRepository
  ) {}

  async execute({
    machineId,
    machineOperatorId,
    reportTime,
  }: EndShiftUseCaseRequest): Promise<EndShiftUseCaseResponse> {
    const machine = await this.machineRepository.findById(machineId);

    if (!machine) {
      return left(new ResourceNotFoundError("machine"));
    }

    const machineOperator =
      await this.machineOperatorRepository.findById(machineOperatorId);

    if (!machineOperator) {
      return left(new ResourceNotFoundError("machineOperator"));
    }

    const invalidMachineOperator =
      machine.machineOperatorId.toString() !== machineOperatorId;

    if (invalidMachineOperator) {
      return left(new NotAllowedError());
    }

    const machineIsStopped =
      machine.status === "Fora de produção" && !machine.workOrderOperationId;

    if (!machineIsStopped) {
      return left(new NotAllowedError());
    }

    machine.status = "Fora de turno";
    machine.machineOperatorId = null;

    await this.machineRepository.save(machine);

    const shiftReport = ShiftReport.create({
      machineId: new UniqueEntityId(machineId),
      machineOperatorId: new UniqueEntityId(machineOperatorId),
      reportTime,
      type: "Shift end",
    });

    await this.shiftReportRepository.create(shiftReport);

    return right({ shiftReport });
  }
}
