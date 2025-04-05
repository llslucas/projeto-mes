import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CreateWorkOrderUseCase } from "@/domain/mes/application/use-cases/create-work-order";
import { RolesGuard } from "@/infra/auth/guards/roles.guard";
import { Roles } from "@/infra/auth/decorators/roles.decorator";

const createWorkOrderBodySchema = z.object({
  number: z.number(),
  sellOrderId: z.string().optional(),
  deliveryDate: z.date({ coerce: true }),
  productName: z.string(),
  productDescription: z.string(),
  status: z.string().optional().default("Aberto"),
  comments: z.string().optional().default(""),
});

const validationPipe = new ZodValidationPipe(createWorkOrderBodySchema);

export type createWorkOrderBodySchema = z.infer<
  typeof createWorkOrderBodySchema
>;

@Controller("/work-orders")
@UseGuards(RolesGuard)
export class CreateWorkOrderController {
  constructor(private createWorkOrder: CreateWorkOrderUseCase) {}

  @Post()
  @Roles(["ADMIN", "USER"])
  async handle(@Body(validationPipe) body: createWorkOrderBodySchema) {
    const {
      number,
      sellOrderId,
      status,
      deliveryDate,
      productName,
      productDescription,
      comments,
    } = body;

    const result = await this.createWorkOrder.execute({
      number,
      sellOrderId,
      status,
      deliveryDate,
      productName,
      productDescription,
      comments,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }
  }
}
