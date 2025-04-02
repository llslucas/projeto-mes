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

describe("End shift (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let sectorFactory: SectorFactory;
  let machineOperatorFactory: MachineOperatorFactory;
  let machineFactory: MachineFactory;
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
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test("[POST] /machines/:machineId/end-shift", async () => {
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

    const machine = await machineFactory.makePrismaMachine({
      sectorId: sector.id,
      machineOperatorId: machineOperator.id,
      status: "Fora de produção",
    });

    const response = await request(app.getHttpServer())
      .post(`/production/machines/${machine.id.toString()}/end-shift`)
      .auth(accessToken, { type: "bearer" })
      .send({
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
        status: "Fora de turno",
      })
    );

    expect(reportOnDatabase.type).toBe("Shift end");
  });
});
