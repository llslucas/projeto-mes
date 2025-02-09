import { UseCaseError } from "@/core/types/use-case-error";

export class SectorAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super(`The sector name already exists.`);
  }
}
