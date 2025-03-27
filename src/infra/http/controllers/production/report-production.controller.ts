import { ReportProductionUseCase } from "@/domain/mes/application/use-cases/report-production";
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation.pipe";

const reportProductionControllerParamSchema = z.object({
  machineId: z.string().uuid(),
});

const reportProductionControllerBodySchema = z.object({
  machineOperatorId: z.string().uuid(),
  workOrderOperationId: z.string().uuid(),
  reportTime: z.string().datetime(),
  partsReported: z.number().min(0),
  scrapsReported: z.number().min(0)
});

const bodyValidationPipe = new ZodValidationPipe(
  reportProductionControllerBodySchema
);
const paramValidationPipe = new ZodValidationPipe(
  reportProductionControllerParamSchema
);

export type reportProductionControllerParamSchema = z.infer<
  typeof reportProductionControllerParamSchema
>;

export type reportProductionControllerBodySchema = z.infer<
  typeof reportProductionControllerBodySchema
>;

@Controller("/machines/:machineId/report-production")
export class ReportProductionController {
  constructor(private reportProductionUseCase: ReportProductionUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: reportProductionControllerBodySchema,
    @Param(paramValidationPipe) param: reportProductionControllerParamSchema
  ) {
    const { machineId } = param;
    const { machineOperatorId, workOrderOperationId, reportTime, partsReported, scrapsReported } = body;

    const result = await this.reportProductionUseCase.execute({
      machineId,
      workOrderOperationId,
      machineOperatorId,
      reportTime: new Date(reportTime),
      partsReported,
      scrapsReported
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }
  }
}
