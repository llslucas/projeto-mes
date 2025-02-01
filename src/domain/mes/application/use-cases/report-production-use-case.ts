import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { ProductionReport } from "../../enterprise/entities/production-report";
import { MachineRepository } from "../repositories/machine-repository";
import { MachineOperatorRepository } from "../repositories/machine-operator-repository";
import { WorkOrderOperationRepository } from "../repositories/work-order-operation-repository";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { WorkOrderOperation } from "../../enterprise/entities/work-order-operation";

interface ReportProductionUseCaseRequest {
  workOrderOperationId: string;
  machineId: string;
  machineOperatorId: string;
  reportTime: Date;
  elapsedTimeInSeconds: number;
  partsReported: number;
  scrapsReported: number;
}

type ReportProductionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    workOrderOperation: WorkOrderOperation;
  }
>;

@Injectable()
export class ReportProductionUseCase {
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
    elapsedTimeInSeconds,
    partsReported,
    scrapsReported,
  }: ReportProductionUseCaseRequest): Promise<ReportProductionUseCaseResponse> {
    const workOrderOperation = await this.workOrderOperationRepository.findById(
      workOrderOperationId.toString()
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

    if (machineOperator.id.toString() !== machineOperatorId) {
      return left(new NotAllowedError());
    }

    if (
      machine.workOrderOperationId.toString() !== workOrderOperationId ||
      machine.machineOperatorId.toString() !== machineOperatorId ||
      machine.status !== "Produzindo"
    ) {
      return left(new NotAllowedError());
    }

    if (partsReported > workOrderOperation.balance) {
      return left(new NotAllowedError());
    }

    const productionReport = ProductionReport.create({
      machineId: new UniqueEntityId(machineId),
      machineOperatorId: new UniqueEntityId(machineOperatorId),
      workOrderOperationId: new UniqueEntityId(workOrderOperationId),
      type: "Production report",
      reportTime,
      partsReported,
      scrapsReported,
      elapsedTimeInSeconds,
    });

    workOrderOperation.productionReports.add(productionReport);
    workOrderOperation.balance -= partsReported + scrapsReported;

    if (workOrderOperation.balance === 0) {
      workOrderOperation.productionEnd = new Date();
    }

    await this.workOrderOperationRepository.save(workOrderOperation);

    return right({ workOrderOperation });
  }
}
