import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { FetchSectorsUseCase } from "@/domain/mes/application/use-cases/fetch-sectors";
import { Roles } from "@/infra/auth/decorators/roles.decorator";
import { RolesGuard } from "@/infra/auth/guards/roles.guard";

const fetchSectorsQuerySchema = z.object({
  search: z.string().optional().default(""),
});

const validationPipe = new ZodValidationPipe(fetchSectorsQuerySchema);

export type fetchSectorsQuerySchema = z.infer<typeof fetchSectorsQuerySchema>;

@Controller("/sectors")
@UseGuards(RolesGuard)
export class FetchSectorsController {
  constructor(private fetchSector: FetchSectorsUseCase) {}

  @Get()
  @Roles(["OPERATOR"])
  async handle(@Query(validationPipe) params: fetchSectorsQuerySchema) {
    const { search } = params;

    const result = await this.fetchSector.execute({
      search,
    });

    return result.value;
  }
}
