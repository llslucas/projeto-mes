import { StartProductionUseCase } from "@/domain/mes/application/use-cases/start-production";
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation.pipe";
import { CurrentUser } from "@/infra/auth/decorators/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { Roles } from "@/infra/auth/decorators/roles.decorator";
import { RolesGuard } from "@/infra/auth/guards/roles.guard";

const startProductionControllerParamSchema = z.object({
  machineId: z.string().uuid(),
});

const startProductionControllerBodySchema = z.object({
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
@UseGuards(RolesGuard)
export class StartProductionController {
  constructor(private startProductionUseCase: StartProductionUseCase) {}

  @Post()
  @Roles(["OPERATOR"])
  async handle(
    @Body(bodyValidationPipe) body: startProductionControllerBodySchema,
    @Param(paramValidationPipe) param: startProductionControllerParamSchema,
    @CurrentUser() operator: UserPayload
  ) {
    const { machineId } = param;
    const { workOrderOperationId, reportTime } = body;

    const result = await this.startProductionUseCase.execute({
      machineId,
      workOrderOperationId,
      machineOperatorId: operator.sub,
      reportTime: new Date(reportTime),
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }
  }
}

