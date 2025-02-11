import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { makeWorkOrder } from "test/factories/make-work-order";

describe("Create work order (E2E)", () => {
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

  test("[POST] /work-orders", async () => {
    const workOrder = makeWorkOrder();

    const response = await request(app.getHttpServer())
      .post("/admin/work-orders")
      .send({
        number: workOrder.number,
        deliveryDate: workOrder.deliveryDate,
        productName: workOrder.productName,
        productDescription: workOrder.productDescription,
      });

    if (response.statusCode !== 201) {
      console.log(response.body.errors);
    }

    expect(response.statusCode).toBe(201);

    const workORderOnDatabase = await prisma.workOrder.findUnique({
      where: {
        number: workOrder.number,
      },
    });

    expect(workORderOnDatabase).toBeTruthy();
  });

  afterAll(async () => {
    await app.close();
  });
});
