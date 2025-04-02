import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { FetchWorkOrderOperationsUseCase } from "@/domain/mes/application/use-cases/fetch-work-order-operations";
import { Roles } from "@/infra/auth/decorators/roles.decorator";
import { RolesGuard } from "@/infra/auth/guards/roles.guard";

const fetchWorkOrderOperationsParamSchema = z.object({
  workOrderId: z.string().uuid(),
});

const validationPipe = new ZodValidationPipe(
  fetchWorkOrderOperationsParamSchema
);

export type fetchWorkOrderOperationsParamSchema = z.infer<
  typeof fetchWorkOrderOperationsParamSchema
>;

@Controller("/work-orders/:workOrderId/operations")
@UseGuards(RolesGuard)
export class FetchWorkOrderOperationsController {
  constructor(
    private fetchWorkOrderOperation: FetchWorkOrderOperationsUseCase
  ) {}

  @Get()
  @Roles(["OPERATOR"])
  async handle(
    @Param(validationPipe) param: fetchWorkOrderOperationsParamSchema
  ) {
    const { workOrderId } = param;

    const result = await this.fetchWorkOrderOperation.execute({
      workOrderId,
    });

    return result.value;
  }
}
