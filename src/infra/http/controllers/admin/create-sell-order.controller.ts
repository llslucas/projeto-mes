import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { CreateSellOrderUseCase } from "@/domain/mes/application/use-cases/create-sell-order";
import { Public } from "@/infra/auth/public";

const createSellOrderBodySchema = z.object({
  number: z.number(),
  clientName: z.string(),
  emissionDate: z.date({ coerce: true }),
  deliveryDate: z.date({ coerce: true }),
  sellerName: z.string(),
  status: z.string(),
});

const validationPipe = new ZodValidationPipe(createSellOrderBodySchema);

export type createSellOrderBodySchema = z.infer<
  typeof createSellOrderBodySchema
>;

@Controller("/sell-orders")
export class CreateSellOrderController {
  constructor(private createSellOrder: CreateSellOrderUseCase) {}

  @Post()
  @Public()
  async handle(@Body(validationPipe) body: createSellOrderBodySchema) {
    const {
      number,
      clientName,
      deliveryDate,
      emissionDate,
      sellerName,
      status,
    } = body;

    const result = await this.createSellOrder.execute({
      number,
      clientName,
      deliveryDate,
      emissionDate,
      sellerName,
      status,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }
  }
}
