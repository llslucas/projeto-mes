import { AppModule } from "@/infra/app.module";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { Test } from "@nestjs/testing";
import { DatabaseModule } from "@/infra/database/database.module";
import { SectorFactory } from "test/factories/make-sector";
import { MachineOperatorFactory } from "test/factories/make-machine-operator";
import { JwtService } from "@nestjs/jwt";
import { WorkOrderFactory } from "test/factories/make-work-order";
import { WorkOrderOperationFactory } from "test/factories/make-work-order-operation";

describe("Fetch work order operations (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let sectorFactory: SectorFactory;
  let machineOperatorFactory: MachineOperatorFactory;
  let workOrderFactory: WorkOrderFactory;
  let workOrderOperationFactory: WorkOrderOperationFactory;
  let accessToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        SectorFactory,
        MachineOperatorFactory,
        WorkOrderFactory,
        WorkOrderOperationFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    sectorFactory = moduleRef.get(SectorFactory);
    machineOperatorFactory = moduleRef.get(MachineOperatorFactory);
    workOrderFactory = moduleRef.get(WorkOrderFactory);
    workOrderOperationFactory = moduleRef.get(WorkOrderOperationFactory);

    await app.init();

    const sector = await sectorFactory.makePrismaSector({
      name: "Teste 1",
    });

    const machineOperator =
      await machineOperatorFactory.makePrismaMachineOperator({
        sectorId: sector.id,
      });

    accessToken = jwt.sign({
      sub: machineOperator.id.toString(),
    });
  });

  test("[GET] /work-orders/:workOrderId/operations", async () => {
    const workOrder = await workOrderFactory.makePrismaWorkOrder();

    await Promise.all([
      workOrderOperationFactory.makePrismaWorkOrderOperation({
        workOrderId: workOrder.id,
      }),
      workOrderOperationFactory.makePrismaWorkOrderOperation({
        workOrderId: workOrder.id,
      }),
      workOrderOperationFactory.makePrismaWorkOrderOperation({
        workOrderId: workOrder.id,
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get(`/production/work-orders/${workOrder.id.toString()}/operations`)
      .auth(accessToken, { type: "bearer" })
      .send();

    if (response.statusCode !== 200) {
      console.log(response.body);
    }

    expect(response.statusCode).toBe(200);
    expect(response.body.workOrderOperations).toHaveLength(3);
  });

  afterAll(async () => {
    await app.close();
  });
});
