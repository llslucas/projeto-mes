import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export type USER_ROLES = "USER" | "ADMIN" | "DISABLED";

export interface UserProps {
  name: string;
  role: USER_ROLES;
  password: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class User extends Entity<UserProps> {
  static create(
    props: Optional<UserProps, "createdAt">,
    id?: UniqueEntityId
  ): User {
    return new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }

  get name() {
    return this.props.name;
  }

  get role() {
    return this.props.role;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get password() {
    return this.props.password;
  }
}
