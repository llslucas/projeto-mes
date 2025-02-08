import { Encrypter } from "@/domain/mes/application/cryptografy/encrypter";

export class FakeEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>) {
    return JSON.stringify(payload);
  }
}
