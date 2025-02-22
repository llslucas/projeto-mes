import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { Controller, Get, Query } from "@nestjs/common";
import { FetchMachinesUseCase } from "@/domain/mes/application/use-cases/fetch-machines";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";

const fetchMachinesQuerySchema = z.object({
  search: z.string().optional().default(""),
});

const validationPipe = new ZodValidationPipe(fetchMachinesQuerySchema);

export type fetchMachinesQuerySchema = z.infer<typeof fetchMachinesQuerySchema>;

@Controller("/machines")
export class FetchMachinesController {
  constructor(private fetchMachines: FetchMachinesUseCase) {}

  @Get()
  async handle(
    @Query(validationPipe) params: fetchMachinesQuerySchema,
    @CurrentUser() operator: UserPayload
  ) {
    const result = await this.fetchMachines.execute({
      machineOperatorId: operator.sub,
    });

    return result.value;
  }
}
