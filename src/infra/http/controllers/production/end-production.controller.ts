import { EndProductionUseCase } from "@/domain/mes/application/use-cases/end-production";
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation.pipe";

const endProductionControllerParamSchema = z.object({
  machineId: z.string().uuid(),
});

const endProductionControllerBodySchema = z.object({
  machineOperatorId: z.string().uuid(),
  workOrderOperationId: z.string().uuid(),
  reportTime: z.string().datetime(),
});

const bodyValidationPipe = new ZodValidationPipe(
  endProductionControllerBodySchema
);
const paramValidationPipe = new ZodValidationPipe(
  endProductionControllerParamSchema
);

export type endProductionControllerParamSchema = z.infer<
  typeof endProductionControllerParamSchema
>;

export type endProductionControllerBodySchema = z.infer<
  typeof endProductionControllerBodySchema
>;

@Controller("/machines/:machineId/end-production")
export class EndProductionController {
  constructor(private endProductionUseCase: EndProductionUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: endProductionControllerBodySchema,
    @Param(paramValidationPipe) param: endProductionControllerParamSchema
  ) {
    const { machineId } = param;
    const { machineOperatorId, workOrderOperationId, reportTime } = body;

    const result = await this.endProductionUseCase.execute({
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
