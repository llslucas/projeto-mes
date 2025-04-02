import { AppModule } from "@/infra/app.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { MachineFactory } from "test/factories/make-machine";
import { MachineOperatorFactory } from "test/factories/make-machine-operator";
import { SectorFactory } from "test/factories/make-sector";
import request from "supertest";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { WorkOrderOperationFactory } from "test/factories/make-work-order-operation";
import { WorkOrderFactory } from "test/factories/make-work-order";

describe("Start setup (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let sectorFactory: SectorFactory;
  let machineOperatorFactory: MachineOperatorFactory;
  let machineFactory: MachineFactory;
  let workOrderFactory: WorkOrderFactory;
  let workOrderOperationFactory: WorkOrderOperationFactory;
  let accessToken: string;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        SectorFactory,
        MachineOperatorFactory,
        MachineFactory,
        WorkOrderFactory,
        WorkOrderOperationFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    sectorFactory = moduleRef.get(SectorFactory);
    machineOperatorFactory = moduleRef.get(MachineOperatorFactory);
    machineFactory = moduleRef.get(MachineFactory);
    workOrderFactory = moduleRef.get(WorkOrderFactory);
    workOrderOperationFactory = moduleRef.get(WorkOrderOperationFactory);
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test("[POST] /machines/:machineId/start-setup", async () => {
    const sector = await sectorFactory.makePrismaSector({
      name: "Teste 1",
    });

    const machineOperator =
      await machineOperatorFactory.makePrismaMachineOperator({
        sectorId: sector.id,
      });

    accessToken = jwt.sign({
      sub: machineOperator.id.toString(),
      role: "OPERATOR",
    });

    const workOrder = await workOrderFactory.makePrismaWorkOrder();
    const workOrderOperation =
      await workOrderOperationFactory.makePrismaWorkOrderOperation({
        workOrderId: workOrder.id,
      });

    const machine = await machineFactory.makePrismaMachine({
      sectorId: sector.id,
      machineOperatorId: machineOperator.id,
      workOrderOperationId: workOrderOperation.id,
      status: "Produzindo",
    });

    const response = await request(app.getHttpServer())
      .post(`/production/machines/${machine.id.toString()}/start-setup`)
      .auth(accessToken, { type: "bearer" })
      .send({
        workOrderOperationId: workOrderOperation.id.toString(),
        machineOperatorId: machineOperator.id.toString(),
        reportTime: new Date(),
      });

    if (response.status !== 201) {
      console.log(response.body.message);
    }

    const machineOnDatabase = await prisma.machine.findFirst();
    const reportOnDatabase = await prisma.report.findFirst();

    expect(response.status).toBe(201);

    expect(machineOnDatabase).toEqual(
      expect.objectContaining({
        status: "Em setup",
        workOrderOperationId: workOrderOperation.id.toString(),
      })
    );

    expect(reportOnDatabase.type).toBe("Setup start");
  });
});

