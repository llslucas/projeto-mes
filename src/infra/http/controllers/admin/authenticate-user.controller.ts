import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { Public } from "@/infra/auth/public";
import { AuthenticateUserUseCase } from "@/domain/mes/application/use-cases/authenticate-user";

const authenticateUserBodySchema = z.object({
  name: z.string(),
  password: z.string(),
});

const validationPipe = new ZodValidationPipe(authenticateUserBodySchema);

export type authenticateUserBodySchema = z.infer<
  typeof authenticateUserBodySchema
>;

@Controller("/sessions")
export class AuthenticateUserController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}

  @Post()
  @Public()
  async handle(@Body(validationPipe) body: authenticateUserBodySchema) {
    const { name, password } = body;

    const result = await this.authenticateUser.execute({
      name,
      password,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }

    return result.value;
  }
}
