import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { AuthenticateMachineOperatorUseCase } from "@/domain/mes/application/use-cases/authenticate-machine-operator";
import { Public } from "@/infra/auth/public";

const authenticateBodySchema = z.object({
  operatorNumber: z.number(),
});

const validationPipe = new ZodValidationPipe(authenticateBodySchema);

export type authenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller("/sessions")
export class AuthenticateController {
  constructor(private authenticate: AuthenticateMachineOperatorUseCase) {}

  @Post()
  @Public()
  async handle(@Body(validationPipe) body: authenticateBodySchema) {
    const { operatorNumber } = body;

    const result = await this.authenticate.execute({
      operatorNumber,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }

    return result.value;
  }
}
