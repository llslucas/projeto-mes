import { UseCaseError } from "@/core/types/use-case-error";

export class UserAlreadyExistsError extends Error implements UseCaseError {
  constructor(user: string) {
    super(`The user ${user} already exists.`);
  }
}
