import { Injectable } from "@nestjs/common";
import { UserRepository } from "../repositories/user-repository";
import { Either, left, right } from "@/core/either";
import { User, USER_ROLES } from "../../enterprise/entities/user";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { HashGenerator } from "../cryptografy/hash-generator";

export interface CreateUserUseCaseRequest {
  name: string;
  role: USER_ROLES;
  password: string;
}

export type CreateUserUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    user: User;
  }
>;

@Injectable()
export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    name,
    role,
    password,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const userExists = await this.userRepository.findByName(name);

    if (userExists) {
      return left(new UserAlreadyExistsError(name));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({
      name,
      role,
      password: hashedPassword,
    });

    this.userRepository.create(user);

    return right({ user });
  }
}
