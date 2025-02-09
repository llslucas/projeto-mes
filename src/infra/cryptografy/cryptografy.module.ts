import { Encrypter } from "@/domain/mes/application/cryptografy/encrypter";
import { Module } from "@nestjs/common";
import { JwtEncrypter } from "./jwt-encrypter";
import { HashComparer } from "@/domain/mes/application/cryptografy/hash-comparer";
import { HashGenerator } from "@/domain/mes/application/cryptografy/hash-generator";
import { BcryptHasher } from "./bcrypt-hasher";

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptografyModule {}
