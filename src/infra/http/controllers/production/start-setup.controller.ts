import { StartSetupUseCase } from "@/domain/mes/application/use-cases/start-setup";
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation.pipe";

const startSetupControllerParamSchema = z.object({
  machineId: z.string().uuid(),
});

const startSetupControllerBodySchema = z.object({
  workOrderOperationId: z.string().uuid(),
  machineOperatorId: z.string().uuid(),
  reportTime: z.string().datetime(),
});

const bodyValidationPipe = new ZodValidationPipe(
  startSetupControllerBodySchema
);

const paramValidationPipe = new ZodValidationPipe(
  startSetupControllerParamSchema
);

export type startSetupControllerParamSchema = z.infer<
  typeof startSetupControllerParamSchema
>;

export type startSetupControllerBodySchema = z.infer<
  typeof startSetupControllerBodySchema
>;

@Controller("/machines/:machineId/start-setup")
export class StartSetupController {
  constructor(private startSetupUseCase: StartSetupUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: startSetupControllerBodySchema,
    @Param(paramValidationPipe) param: startSetupControllerParamSchema
  ) {
    const { machineId } = param;
    const { workOrderOperationId, machineOperatorId, reportTime } = body;

    const result = await this.startSetupUseCase.execute({
      machineId,
      machineOperatorId,
      workOrderOperationId,
      reportTime: new Date(reportTime)
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }
  }
}
