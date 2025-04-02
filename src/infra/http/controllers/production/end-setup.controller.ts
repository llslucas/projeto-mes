import { EndSetupUseCase } from "@/domain/mes/application/use-cases/end-setup";
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

const endSetupControllerParamSchema = z.object({
  machineId: z.string().uuid(),
});

const endSetupControllerBodySchema = z.object({
  workOrderOperationId: z.string().uuid(),
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
@UseGuards(RolesGuard)
export class EndSetupController {
  constructor(private endSetupUseCase: EndSetupUseCase) {}

  @Post()
  @Roles(["OPERATOR"])
  async handle(
    @Body(bodyValidationPipe) body: endSetupControllerBodySchema,
    @Param(paramValidationPipe) param: endSetupControllerParamSchema,
    @CurrentUser() operator: UserPayload
  ) {
    const { machineId } = param;
    const { workOrderOperationId, reportTime } = body;

    const result = await this.endSetupUseCase.execute({
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
