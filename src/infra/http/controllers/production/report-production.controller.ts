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
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";

const reportProductionControllerParamSchema = z.object({
  machineId: z.string().uuid(),
});

const reportProductionControllerBodySchema = z.object({
  workOrderOperationId: z.string().uuid(),
  reportTime: z.string().datetime(),
  partsReported: z.number().min(0),
  scrapsReported: z.number().min(0),
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
    @Param(paramValidationPipe) param: reportProductionControllerParamSchema,
    @CurrentUser() operator: UserPayload
  ) {
    const { machineId } = param;
    const { workOrderOperationId, reportTime, partsReported, scrapsReported } =
      body;

    const result = await this.reportProductionUseCase.execute({
      machineId,
      workOrderOperationId,
      machineOperatorId: operator.sub,
      reportTime: new Date(reportTime),
      partsReported,
      scrapsReported,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }
  }
}

