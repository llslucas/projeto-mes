import { UseCaseError } from "@/core/types/use-case-error";

export class SellOrderAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super(`The sell order number already exists.`);
  }
}
