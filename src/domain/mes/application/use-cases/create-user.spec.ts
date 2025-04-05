import { makeUser } from "test/factories/make-user";
import { InMemoryUserRepository } from "test/repositories/in-memory-user-repository";
import { CreateUserUseCase } from "./create-user";
import { FakeHasher } from "test/cryptografy/fake-hasher";

describe("Create user use case", () => {
  let userRepository: InMemoryUserRepository;
  let hashGenerator: FakeHasher;
  let sut: CreateUserUseCase;

  beforeEach(async () => {
    userRepository = new InMemoryUserRepository();
    hashGenerator = new FakeHasher();
    sut = new CreateUserUseCase(userRepository, hashGenerator);
  });

  it("should create a user with a hashed password.", async () => {
    const user = makeUser();

    const result = await sut.execute({
      name: user.name,
      role: user.role,
      password: user.password,
    });

    const success = result.isRight();

    expect(success).toBe(true);

    if (success) {
      const userOnRepository = userRepository.items[0];
      expect(userOnRepository).toEqual(result.value.user);
      expect(result.value.user.password).toEqual(
        user.password.concat("-hashed")
      );
    }
  });
});
