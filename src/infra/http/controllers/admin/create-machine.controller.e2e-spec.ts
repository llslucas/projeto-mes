import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { makeMachine } from "test/factories/make-machine";
import { SectorFactory } from "test/factories/make-sector";
import { UserFactory } from "test/factories/make-user";

describe("Create machine (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let sectorFactory: SectorFactory;
  let jwt: JwtService;
  let userFactory: UserFactory;
  let accessToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [SectorFactory, UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    sectorFactory = moduleRef.get(SectorFactory);
    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[POST] /admin/machines", async () => {
    const user = await userFactory.makePrismaUser({
      name: "user-teste",
      role: "ADMIN",
    });

    accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    });

    const sector = await sectorFactory.makePrismaSector();
    const machine = makeMachine();

    const response = await request(app.getHttpServer())
      .post("/admin/machines")
      .auth(accessToken, { type: "bearer" })
      .send({
        sectorId: sector.id.toString(),
        name: machine.name,
        description: machine.description,
      });

    if (response.statusCode !== 201) {
      console.log(response.body.errors);
    }

    expect(response.statusCode).toBe(201);

    const machineOnDatabase = await prisma.machine.findFirst({
      where: {
        name: machine.name,
      },
    });

    expect(machineOnDatabase).toBeTruthy();
  });

  afterAll(async () => {
    await app.close();
  });
});
