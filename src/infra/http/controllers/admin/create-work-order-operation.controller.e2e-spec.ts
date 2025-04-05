import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { UserFactory } from "test/factories/make-user";
import { WorkOrderFactory } from "test/factories/make-work-order";
import { makeWorkOrderOperation } from "test/factories/make-work-order-operation";

describe("Create work order operation (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let workOrderFactory: WorkOrderFactory;
  let jwt: JwtService;
  let userFactory: UserFactory;
  let accessToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [WorkOrderFactory, UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    workOrderFactory = moduleRef.get(WorkOrderFactory);
    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[POST] /work-orders/:workOrderId/operations", async () => {
    const user = await userFactory.makePrismaUser({
      name: "user-teste",
      role: "ADMIN",
    });

    accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    });

    const workOrder = await workOrderFactory.makePrismaWorkOrder();

    const workOrderOperation = makeWorkOrderOperation({
      workOrderId: workOrder.id,
    });

    const response = await request(app.getHttpServer())
      .post(`/admin/work-orders/${workOrder.id.toString()}/operations`)
      .auth(accessToken, { type: "bearer" })
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
