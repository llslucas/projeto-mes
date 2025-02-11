import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { CreateWorkOrderUseCase } from "@/domain/mes/application/use-cases/create-work-order";
import { Public } from "@/infra/auth/public";

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
export class CreateWorkOrderController {
  constructor(private createWorkOrder: CreateWorkOrderUseCase) {}

  @Post()
  @Public()
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
