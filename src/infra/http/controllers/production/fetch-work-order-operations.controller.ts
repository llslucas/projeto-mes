import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { Controller, Get, Param } from "@nestjs/common";
import { FetchWorkOrderOperationsUseCase } from "@/domain/mes/application/use-cases/fetch-work-order-operations";

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
export class FetchWorkOrderOperationsController {
  constructor(
    private fetchWorkOrderOperation: FetchWorkOrderOperationsUseCase
  ) {}

  @Get()
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
