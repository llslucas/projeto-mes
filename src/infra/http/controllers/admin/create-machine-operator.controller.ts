import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CreateMachineOperatorUseCase } from "@/domain/mes/application/use-cases/create-machine-operator";
import { Roles } from "@/infra/auth/decorators/roles.decorator";
import { RolesGuard } from "@/infra/auth/guards/roles.guard";

const createMachineOperatorBodySchema = z.object({
  name: z.string(),
  number: z.number(),
  level: z.enum(["Worker", "Leader"]).optional().default("Worker"),
  sectorId: z.string().uuid(),
});

const validationPipe = new ZodValidationPipe(createMachineOperatorBodySchema);

export type createMachineOperatorBodySchema = z.infer<
  typeof createMachineOperatorBodySchema
>;

@Controller("/machine-operators")
@UseGuards(RolesGuard)
export class CreateMachineOperatorController {
  constructor(private createMachineOperator: CreateMachineOperatorUseCase) {}

  @Post()
  @Roles(["ADMIN", "USER"])
  async handle(@Body(validationPipe) body: createMachineOperatorBodySchema) {
    const { name, number, level, sectorId } = body;

    const result = await this.createMachineOperator.execute({
      name,
      number,
      level,
      sectorId,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }
  }
}
