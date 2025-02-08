import { UseCaseError } from "@/core/types/use-case-error";

export class MachineOperatorAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`The machine operator already exists.`);
  }
}
