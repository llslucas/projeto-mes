import { User } from "../../enterprise/entities/user";

export abstract class UserRepository {
  abstract findById(userId: string): Promise<User | null>;
  abstract findByName(userName: string): Promise<User | null>;
  abstract create(user: User): Promise<void>;
  abstract save(user: User): Promise<void>;
}
