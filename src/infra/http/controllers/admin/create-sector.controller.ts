import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { CreateSectorUseCase } from "@/domain/mes/application/use-cases/create-sector";
import { Public } from "@/infra/auth/public";

const createSectorBodySchema = z.object({
  name: z.string(),
  description: z.string(),
});

const validationPipe = new ZodValidationPipe(createSectorBodySchema);

export type createSectorBodySchema = z.infer<typeof createSectorBodySchema>;

@Controller("/sector")
export class CreateSectorController {
  constructor(private createSector: CreateSectorUseCase) {}

  @Post()
  @Public()
  async handle(@Body(validationPipe) body: createSectorBodySchema) {
    const { name, description } = body;

    const result = await this.createSector.execute({
      name: name,
      description: description,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }
  }
}
