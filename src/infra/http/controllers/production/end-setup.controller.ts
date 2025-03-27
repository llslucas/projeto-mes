import { EndSetupUseCase } from "@/domain/mes/application/use-cases/end-setup";
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation.pipe";

const endSetupControllerParamSchema = z.object({
  machineId: z.string().uuid(),
});

const endSetupControllerBodySchema = z.object({
  workOrderOperationId: z.string().uuid(),
  machineOperatorId: z.string().uuid(),
  reportTime: z.string().datetime(),
});

const bodyValidationPipe = new ZodValidationPipe(endSetupControllerBodySchema);

const paramValidationPipe = new ZodValidationPipe(
  endSetupControllerParamSchema
);

export type endSetupControllerParamSchema = z.infer<
  typeof endSetupControllerParamSchema
>;

export type endSetupControllerBodySchema = z.infer<
  typeof endSetupControllerBodySchema
>;

@Controller("/machines/:machineId/end-setup")
export class EndSetupController {
  constructor(private endSetupUseCase: EndSetupUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: endSetupControllerBodySchema,
    @Param(paramValidationPipe) param: endSetupControllerParamSchema
  ) {
    const { machineId } = param;
    const { workOrderOperationId, machineOperatorId, reportTime } = body;

    const result = await this.endSetupUseCase.execute({
      machineId,
      machineOperatorId,
      workOrderOperationId,
      reportTime: new Date(reportTime),
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }
  }
}
