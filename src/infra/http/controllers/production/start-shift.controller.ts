import { StartShiftUseCase } from "@/domain/mes/application/use-cases/start-shift";
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

const startShiftControllerParamSchema = z.object({
  machineId: z.string().uuid(),
});

const startShiftControllerBodySchema = z.object({
  reportTime: z.string().datetime(),
});

const bodyValidationPipe = new ZodValidationPipe(
  startShiftControllerBodySchema
);
const paramValidationPipe = new ZodValidationPipe(
  startShiftControllerParamSchema
);

export type startShiftControllerParamSchema = z.infer<
  typeof startShiftControllerParamSchema
>;

export type startShiftControllerBodySchema = z.infer<
  typeof startShiftControllerBodySchema
>;

@Controller("/machines/:machineId/start-shift")
export class StartShiftController {
  constructor(private startShiftUseCase: StartShiftUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: startShiftControllerBodySchema,
    @Param(paramValidationPipe) param: startShiftControllerParamSchema,
    @CurrentUser() operator: UserPayload
  ) {
    const { machineId } = param;
    const { reportTime } = body;

    const result = await this.startShiftUseCase.execute({
      machineId,
      machineOperatorId: operator.sub,
      reportTime: new Date(reportTime),
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }
  }
}
