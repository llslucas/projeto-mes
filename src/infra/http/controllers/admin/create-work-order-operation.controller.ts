import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { CreateWorkOrderOperationUseCase } from "@/domain/mes/application/use-cases/create-work-order-operation";
import { Public } from "@/infra/auth/public";

const createWorkOrderOperationBodySchema = z.object({
  workOrderId: z.string().uuid(),
  number: z.number(),
  description: z.string(),
  quantity: z.number(),
  balance: z.number().optional(),
});

const validationPipe = new ZodValidationPipe(
  createWorkOrderOperationBodySchema
);

export type createWorkOrderOperationBodySchema = z.infer<
  typeof createWorkOrderOperationBodySchema
>;

@Controller("/work-order-operations")
export class CreateWorkOrderOperationController {
  constructor(
    private createWorkOrderOperation: CreateWorkOrderOperationUseCase
  ) {}

  @Post()
  @Public()
  async handle(@Body(validationPipe) body: createWorkOrderOperationBodySchema) {
    const { number, description, quantity, balance, workOrderId } = body;

    const result = await this.createWorkOrderOperation.execute({
      workOrderId,
      number,
      description,
      quantity,
      balance,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }
  }
}
