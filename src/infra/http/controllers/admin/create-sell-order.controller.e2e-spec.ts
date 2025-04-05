import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { makeSellOrder } from "test/factories/make-sell-order";
import { UserFactory } from "test/factories/make-user";

describe("Create sell order (E2E)", () => {
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

  test("[POST] /sell-orders", async () => {
    const user = await userFactory.makePrismaUser({
      name: "user-teste",
      role: "ADMIN",
    });

    accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    });

    const sellOrder = makeSellOrder();

    const response = await request(app.getHttpServer())
      .post("/admin/sell-orders")
      .auth(accessToken, { type: "bearer" })
      .send({
        number: sellOrder.number,
        clientName: sellOrder.clientName,
        deliveryDate: sellOrder.deliveryDate,
        emissionDate: sellOrder.emissionDate,
        sellerName: sellOrder.sellerName,
        status: sellOrder.status,
      });

    if (response.statusCode !== 201) {
      console.log(response.body);
    }

    expect(response.statusCode).toBe(201);

    const questionOnDatabase = await prisma.sellOrder.findUnique({
      where: {
        number: sellOrder.number,
      },
    });

    expect(questionOnDatabase).toBeTruthy();
  });

  afterAll(async () => {
    await app.close();
  });
});
