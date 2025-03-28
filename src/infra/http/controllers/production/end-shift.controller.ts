import { EndShiftUseCase } from "@/domain/mes/application/use-cases/end-shift";
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation.pipe";

const endShiftControllerParamSchema = z.object({
  machineId: z.string().uuid(),
});

const endShiftControllerBodySchema = z.object({
  machineOperatorId: z.string().uuid(),
  reportTime: z.string().datetime(),
});

const bodyValidationPipe = new ZodValidationPipe(endShiftControllerBodySchema);

const paramValidationPipe = new ZodValidationPipe(
  endShiftControllerParamSchema
);

export type endShiftControllerParamSchema = z.infer<
  typeof endShiftControllerParamSchema
>;

export type endShiftControllerBodySchema = z.infer<
  typeof endShiftControllerBodySchema
>;

@Controller("/machines/:machineId/end-shift")
export class EndShiftController {
  constructor(private endShiftUseCase: EndShiftUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: endShiftControllerBodySchema,
    @Param(paramValidationPipe) param: endShiftControllerParamSchema
  ) {
    const { machineId } = param;
    const { machineOperatorId, reportTime } = body;

    const result = await this.endShiftUseCase.execute({
      machineId,
      machineOperatorId,
      reportTime: new Date(reportTime),
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }
  }
}
