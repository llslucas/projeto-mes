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
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";

const endShiftControllerParamSchema = z.object({
  machineId: z.string().uuid(),
});

const endShiftControllerBodySchema = z.object({
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
    @Param(paramValidationPipe) param: endShiftControllerParamSchema,
    @CurrentUser() operator: UserPayload
  ) {
    const { machineId } = param;
    const { reportTime } = body;

    const result = await this.endShiftUseCase.execute({
      machineId,
      machineOperatorId: operator.sub,
      reportTime: new Date(reportTime),
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }
  }
}
