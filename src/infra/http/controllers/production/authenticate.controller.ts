import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { AuthenticateMachineOperatorUseCase } from "@/domain/mes/application/use-cases/authenticate-machine-operator";
import { Public } from "@/infra/auth/public";

const createSectorBodySchema = z.object({
  number: z.number(),
});

const validationPipe = new ZodValidationPipe(createSectorBodySchema);

export type createSectorBodySchema = z.infer<typeof createSectorBodySchema>;

@Controller("/sessions")
export class AuthenticateController {
  constructor(private createSector: AuthenticateMachineOperatorUseCase) {}

  @Post()
  @Public()
  async handle(@Body(validationPipe) body: createSectorBodySchema) {
    const { number } = body;

    const result = await this.createSector.execute({
      number,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }

    return result.value;
  }
}
