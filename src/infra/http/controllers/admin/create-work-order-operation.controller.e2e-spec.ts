import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { WorkOrderFactory } from "test/factories/make-work-order";
import { makeWorkOrderOperation } from "test/factories/make-work-order-operation";

describe("Create work order operation (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let workOrderFactory: WorkOrderFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [WorkOrderFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    workOrderFactory = moduleRef.get(WorkOrderFactory);

    await app.init();
  });

  test("[POST] /work-order-operations", async () => {
    const workOrder = await workOrderFactory.makePrismaWorkOrder();

    const workOrderOperation = makeWorkOrderOperation({
      workOrderId: workOrder.id,
    });

    const response = await request(app.getHttpServer())
      .post("/admin/work-order-operations")
      .send({
        workOrderId: workOrder.id.toString(),
        number: workOrderOperation.number,
        description: workOrderOperation.description,
        quantity: workOrderOperation.quantity,
        balance: workOrderOperation.balance,
      });

    if (response.statusCode !== 201) {
      console.log(response.body);
    }

    expect(response.statusCode).toBe(201);

    const workOrderOperationOnDatabase = await prisma.workOrder.findUnique({
      where: {
        number: workOrder.number,
      },
    });

    expect(workOrderOperationOnDatabase).toBeTruthy();
  });

  afterAll(async () => {
    await app.close();
  });
});
