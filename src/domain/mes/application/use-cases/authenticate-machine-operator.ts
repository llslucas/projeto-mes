import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { MachineOperatorRepository } from "../repositories/machine-operator-repository";
import { Encrypter } from "../cryptografy/encrypter";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";

interface AuthenticateMachineOperatorUseCaseRequest {
  number: number;
}

type AuthenticateMachineOperatorUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    accessToken: string;
  }
>;

@Injectable()
export class AuthenticateMachineOperatorUseCase {
  constructor(
    private machineOperatorRepository: MachineOperatorRepository,
    private encrypter: Encrypter
  ) {}

  async execute({
    number,
  }: AuthenticateMachineOperatorUseCaseRequest): Promise<AuthenticateMachineOperatorUseCaseResponse> {
    const machineOperator =
      await this.machineOperatorRepository.findByNumber(number);

    if (!machineOperator) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: machineOperator.id.toString(),
    });

    return right({ accessToken });
  }
}
