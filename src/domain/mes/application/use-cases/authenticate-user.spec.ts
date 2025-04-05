import { FakeEncrypter } from "test/cryptografy/fake-encrypter";
import { AuthenticateUserUseCase } from "./authenticate-user";
import { InMemoryUserRepository } from "test/repositories/in-memory-user-repository";
import { FakeHasher } from "test/cryptografy/fake-hasher";
import { makeUser } from "test/factories/make-user";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";

describe("Authenticate user use case", () => {
  let userRepository: InMemoryUserRepository;
  let hasher: FakeHasher;
  let fakeEncrypter: FakeEncrypter;
  let sut: AuthenticateUserUseCase;

  beforeEach(async () => {
    userRepository = new InMemoryUserRepository();
    hasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateUserUseCase(userRepository, hasher, fakeEncrypter);
  });

  it("should authenticate a user", async () => {
    const user = makeUser({
      name: "user-teste",
      role: "ADMIN",
      password: "password-hashed",
    });

    userRepository.items.push(user);

    const result = await sut.execute({
      name: "user-teste",
      password: "password",
    });

    const success = result.isRight();

    expect(success).toBe(true);

    if (success) {
      expect(result.value).toEqual({
        accessToken: JSON.stringify({
          sub: user.id.toString(),
          role: "ADMIN",
        }),
      });
    }
  });

  it("should return an wrong credentials error if the user does not exists", async () => {
    const user = makeUser({
      name: "user-teste",
      role: "ADMIN",
      password: "password-hashed",
    });

    userRepository.items.push(user);

    const result = await sut.execute({
      name: "fake-user",
      password: "password",
    });

    const error = result.isLeft();

    expect(error).toBe(true);

    if (error) {
      expect(result.value).toBeInstanceOf(WrongCredentialsError);
    }
  });

  it("should return an wrong credentials error if the password is incorrect", async () => {
    const user = makeUser({
      name: "user-teste",
      role: "ADMIN",
      password: "password-hashed",
    });

    userRepository.items.push(user);

    const result = await sut.execute({
      name: "user-teste",
      password: "wrong-password",
    });

    const error = result.isLeft();

    expect(error).toBe(true);

    if (error) {
      expect(result.value).toBeInstanceOf(WrongCredentialsError);
    }
  });
});
