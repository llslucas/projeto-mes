import { StartSetupUseCase } from "@/domain/mes/application/use-cases/start-setup";
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

const startSetupControllerParamSchema = z.object({
  machineId: z.string().uuid(),
});

const startSetupControllerBodySchema = z.object({
  workOrderOperationId: z.string().uuid(),
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
@UseGuards(RolesGuard)
export class StartSetupController {
  constructor(private startSetupUseCase: StartSetupUseCase) {}

  @Post()
  @Roles(["OPERATOR"])
  async handle(
    @Body(bodyValidationPipe) body: startSetupControllerBodySchema,
    @Param(paramValidationPipe) param: startSetupControllerParamSchema,
    @CurrentUser() operator: UserPayload
  ) {
    const { machineId } = param;
    const { workOrderOperationId, reportTime } = body;

    const result = await this.startSetupUseCase.execute({
      machineId,
      machineOperatorId: operator.sub,
      workOrderOperationId,
      reportTime: new Date(reportTime),
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }
  }
}

