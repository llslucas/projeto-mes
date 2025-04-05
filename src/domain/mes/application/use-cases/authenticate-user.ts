import { Either, left, right } from "@/core/either";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";
import { UserRepository } from "../repositories/user-repository";
import { HashComparer } from "../cryptografy/hash-comparer";
import { Encrypter } from "../cryptografy/encrypter";
import { Injectable } from "@nestjs/common";

export interface AuthenticateUserUseCaseRequest {
  name: string;
  password: string;
}

export type AuthenticateUserUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string;
  }
>;

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter
  ) {}

  async execute({
    name,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.userRepository.findByName(name);

    if (!user) {
      return left(new WrongCredentialsError());
    }

    const validPassword = await this.hashComparer.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
      role: user.role,
    });

    return right({ accessToken });
  }
}
