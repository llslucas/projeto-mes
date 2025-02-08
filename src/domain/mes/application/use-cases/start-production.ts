import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { MachineRepository } from "../repositories/machine-repository";
import { MachineOperatorRepository } from "../repositories/machine-operator-repository";
import { WorkOrderOperationRepository } from "../repositories/work-order-operation-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { WorkOrderOperation } from "../../enterprise/entities/work-order-operation";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ProductionReport } from "../../enterprise/entities/production-report";

interface StartProductionUseCaseRequest {
  workOrderOperationId: string;
  machineId: string;
  machineOperatorId: string;
  reportTime: Date;
}

type StartProductionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    workOrderOperation: WorkOrderOperation;
  }
>;

@Injectable()
export class StartProductionUseCase {
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
  }: StartProductionUseCaseRequest): Promise<StartProductionUseCaseResponse> {
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

    if (
      machine.machineOperatorId.toString() !== machineOperatorId ||
      machine.status !== "Fora de produção" ||
      machine.workOrderOperationId
    ) {
      return left(new NotAllowedError());
    }

    const productionReport = ProductionReport.create({
      machineId: new UniqueEntityId(machineId),
      machineOperatorId: new UniqueEntityId(machineOperatorId),
      workOrderOperationId: new UniqueEntityId(workOrderOperationId),
      type: "Production start",
      reportTime,
    });

    workOrderOperation.productionReports.add(productionReport);

    await this.workOrderOperationRepository.save(workOrderOperation);

    machine.status = "Produzindo";
    machine.workOrderOperationId = new UniqueEntityId(workOrderOperationId);
    machine.lastReportId = productionReport.id;
    machine.lastReportTime = productionReport.reportTime;

    await this.machineRepository.save(machine);

    return right({ workOrderOperation });
  }
}
