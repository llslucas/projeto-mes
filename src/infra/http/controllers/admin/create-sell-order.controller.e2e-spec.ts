import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { makeSellOrder } from "test/factories/make-sell-order";

describe("Create sell order (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test("[POST] /sell-orders", async () => {
    const sellOrder = makeSellOrder();

    const response = await request(app.getHttpServer())
      .post("/admin/sell-orders")
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
