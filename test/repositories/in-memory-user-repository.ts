import { UserRepository } from "@/domain/mes/application/repositories/user-repository";
import { User } from "@/domain/mes/enterprise/entities/user";

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = [];

  async findById(userId: string) {
    const user = this.items.find((item) => item.id.toString() === userId);
    return user || null;
  }

  async findByName(userName: string) {
    const user = this.items.find((item) => item.name === userName);
    return user || null;
  }

  async create(user: User) {
    this.items.push(user);
  }

  async save(user: User) {
    const index = this.items.findIndex((item) => item.id.equals(user.id));

    if (index !== -1) {
      user[index] = user;
    } else {
      this.create(user);
    }
  }
}
