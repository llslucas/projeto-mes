import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { MachineRepository } from "../repositories/machine-repository";
import { MachineOperatorRepository } from "../repositories/machine-operator-repository";
import { WorkOrderOperationRepository } from "../repositories/work-order-operation-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { WorkOrderOperation } from "../../enterprise/entities/work-order-operation";
import { SetupReport } from "../../enterprise/entities/setup-report";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

interface StartSetupUseCaseRequest {
  workOrderOperationId: string;
  machineId: string;
  machineOperatorId: string;
  reportTime: Date;
}

type StartSetupUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    workOrderOperation: WorkOrderOperation;
  }
>;

@Injectable()
export class StartSetupUseCase {
  constructor(
    private workOrderOperationRepository: WorkOrderOperationRepository,
    private machineRepository: MachineRepository,
    private machineOperatorRepository: MachineOperatorRepository
  ) {}

  async execute({
    workOrderOperationId,
    machineId,
    machineOperatorId,
    reportTime,
  }: StartSetupUseCaseRequest): Promise<StartSetupUseCaseResponse> {
    const workOrderOperation = await this.workOrderOperationRepository.findById(
      workOrderOperationId
    );

    if (!workOrderOperation) {
      return left(new ResourceNotFoundError("workOrderOperation"));
    }

    const machine = await this.machineRepository.findById(machineId);

    if (!machine) {
      return left(new ResourceNotFoundError("machine"));
    }

    const machineOperator =
      await this.machineOperatorRepository.findById(machineOperatorId);

    if (!machineOperator) {
      return left(new ResourceNotFoundError("machineOperator"));
    }

    if (
      !machine.workOrderOperationId ||
      machine.workOrderOperationId.toString() !== workOrderOperationId ||
      machine.machineOperatorId.toString() !== machineOperatorId ||
      machine.status !== "Produzindo"
    ) {
      return left(new NotAllowedError());
    }

    const setupReport = SetupReport.create({
      machineId: new UniqueEntityId(machineId),
      machineOperatorId: new UniqueEntityId(machineOperatorId),
      workOrderOperationId: new UniqueEntityId(workOrderOperationId),
      type: "Setup start",
      reportTime,
    });

    workOrderOperation.setupReports.add(setupReport);
    await this.workOrderOperationRepository.save(workOrderOperation);

    machine.status = "Em setup";
    machine.lastReportId = setupReport.id;
    machine.lastReportTime = setupReport.reportTime;
    await this.machineRepository.save(machine);

    return right({ workOrderOperation });
  }
}
