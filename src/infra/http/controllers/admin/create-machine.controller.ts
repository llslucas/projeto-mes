import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { CreateMachineUseCase } from "@/domain/mes/application/use-cases/create-machine";
import { Public } from "@/infra/auth/public";

const createMachineBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  sectorId: z.string().uuid(),
});

const validationPipe = new ZodValidationPipe(createMachineBodySchema);

export type createMachineBodySchema = z.infer<typeof createMachineBodySchema>;

@Controller("/machine")
export class CreateMachineController {
  constructor(private createMachine: CreateMachineUseCase) {}

  @Post()
  @Public()
  async handle(@Body(validationPipe) body: createMachineBodySchema) {
    const { name, description, sectorId } = body;

    const result = await this.createMachine.execute({
      name,
      description,
      sectorId,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }
  }
}
