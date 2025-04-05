import { AppModule } from "@/infra/app.module";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { Test } from "@nestjs/testing";
import { DatabaseModule } from "@/infra/database/database.module";
import { UserFactory } from "test/factories/make-user";
import { HashGenerator } from "@/domain/mes/application/cryptografy/hash-generator";
import { CryptografyModule } from "@/infra/cryptografy/cryptografy.module";

describe("Create work order (E2E)", () => {
  let app: INestApplication;
  let hasher: HashGenerator;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptografyModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);
    hasher = moduleRef.get(HashGenerator);

    await app.init();
  });

  test("[POST] /sessions", async () => {
    const user = await userFactory.makePrismaUser({
      name: "user-teste",
      password: await hasher.hash("password"),
    });

    const response = await request(app.getHttpServer())
      .post("/admin/sessions")
      .send({
        name: user.name,
        password: "password",
      });

    if (response.statusCode !== 201) {
      console.log(response.body.errors);
    }

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("accessToken");
  });

  afterAll(async () => {
    await app.close();
  });
});
