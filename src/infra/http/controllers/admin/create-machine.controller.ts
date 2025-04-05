import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CreateMachineUseCase } from "@/domain/mes/application/use-cases/create-machine";
import { Roles } from "@/infra/auth/decorators/roles.decorator";
import { RolesGuard } from "@/infra/auth/guards/roles.guard";

const createMachineBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  sectorId: z.string().uuid(),
});

const validationPipe = new ZodValidationPipe(createMachineBodySchema);

export type createMachineBodySchema = z.infer<typeof createMachineBodySchema>;

@Controller("/machines")
@UseGuards(RolesGuard)
export class CreateMachineController {
  constructor(private createMachine: CreateMachineUseCase) {}

  @Post()
  @Roles(["ADMIN", "USER"])
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
