import { StartProductionUseCase } from "@/domain/mes/application/use-cases/start-production";
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation.pipe";

const startProductionControllerParamSchema = z.object({
  machineId: z.string().uuid(),
});

const startProductionControllerBodySchema = z.object({
  machineOperatorId: z.string().uuid(),
  workOrderOperationId: z.string().uuid(),
  reportTime: z.string().datetime(),
});

const bodyValidationPipe = new ZodValidationPipe(
  startProductionControllerBodySchema
);
const paramValidationPipe = new ZodValidationPipe(
  startProductionControllerParamSchema
);

export type startProductionControllerParamSchema = z.infer<
  typeof startProductionControllerParamSchema
>;

export type startProductionControllerBodySchema = z.infer<
  typeof startProductionControllerBodySchema
>;

@Controller("/machines/:machineId/start-production")
export class StartProductionController {
  constructor(private startProductionUseCase: StartProductionUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: startProductionControllerBodySchema,
    @Param(paramValidationPipe) param: startProductionControllerParamSchema
  ) {
    const { machineId } = param;
    const { machineOperatorId, workOrderOperationId, reportTime } = body;

    const result = await this.startProductionUseCase.execute({
      machineId,
      workOrderOperationId,
      machineOperatorId,
      reportTime: new Date(reportTime),
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }
  }
}
