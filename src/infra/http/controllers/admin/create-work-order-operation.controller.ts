import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Param,
  UseGuards,
} from "@nestjs/common";
import { CreateWorkOrderOperationUseCase } from "@/domain/mes/application/use-cases/create-work-order-operation";
import { Roles } from "@/infra/auth/decorators/roles.decorator";
import { RolesGuard } from "@/infra/auth/guards/roles.guard";

const createWorkOrderOperationParamSchema = z.object({
  workOrderId: z.string().uuid(),
});

const createWorkOrderOperationBodySchema = z.object({
  number: z.number(),
  description: z.string(),
  quantity: z.number(),
  balance: z.number().optional(),
});

const paramValidationPipe = new ZodValidationPipe(
  createWorkOrderOperationParamSchema
);

const bodyValidationPipe = new ZodValidationPipe(
  createWorkOrderOperationBodySchema
);

export type CreateWorkOrderOperationParamSchema = z.infer<
  typeof createWorkOrderOperationParamSchema
>;

export type CreateWorkOrderOperationBodySchema = z.infer<
  typeof createWorkOrderOperationBodySchema
>;

@Controller("/work-orders/:workOrderId/operations")
@UseGuards(RolesGuard)
export class CreateWorkOrderOperationController {
  constructor(
    private createWorkOrderOperation: CreateWorkOrderOperationUseCase
  ) {}

  @Post()
  @Roles(["ADMIN", "USER"])
  async handle(
    @Param(paramValidationPipe) param: CreateWorkOrderOperationParamSchema,
    @Body(bodyValidationPipe) body: CreateWorkOrderOperationBodySchema
  ) {
    const { workOrderId } = param;
    const { number, description, quantity, balance } = body;

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
