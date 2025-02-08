import { HashComparer } from "@/domain/mes/application/cryptografy/hash-comparer";
import { HashGenerator } from "@/domain/mes/application/cryptografy/hash-generator";

export class FakeHasher implements HashGenerator, HashComparer {
  async hash(plain: string) {
    return plain.concat("-hashed");
  }

  async compare(plain: string, hash: string) {
    return plain.concat("-hashed") === hash;
  }
}
