import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { Controller, Get, Query } from "@nestjs/common";
import { FetchSectorsUseCase } from "@/domain/mes/application/use-cases/fetch-sectors";

const fetchSectorsQuerySchema = z.object({
  search: z.string().optional().default(""),
});

const validationPipe = new ZodValidationPipe(fetchSectorsQuerySchema);

export type fetchSectorsQuerySchema = z.infer<typeof fetchSectorsQuerySchema>;

@Controller("/sectors")
export class FetchSectorsController {
  constructor(private fetchSector: FetchSectorsUseCase) {}

  @Get()
  async handle(@Query(validationPipe) params: fetchSectorsQuerySchema) {
    const { search } = params;

    const result = await this.fetchSector.execute({
      search,
    });

    return result.value;
  }
}
