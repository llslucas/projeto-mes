import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { makeSector } from "test/factories/make-sector";
import { UserFactory } from "test/factories/make-user";

describe("Create sector (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let userFactory: UserFactory;
  let accessToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[POST] /admin/sectors", async () => {
    const user = await userFactory.makePrismaUser({
      name: "user-teste",
      role: "ADMIN",
    });

    accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    });

    const sector = makeSector();

    const response = await request(app.getHttpServer())
      .post("/admin/sectors")
      .auth(accessToken, { type: "bearer" })
      .send({
        name: sector.name,
        description: sector.description,
      });

    if (response.statusCode !== 201) {
      console.log(response.body);
    }

    expect(response.statusCode).toBe(201);

    const sectorOnDatabase = await prisma.sector.findFirst({
      where: {
        name: sector.name,
      },
    });

    expect(sectorOnDatabase).toBeTruthy();
  });

  afterAll(async () => {
    await app.close();
  });
});
