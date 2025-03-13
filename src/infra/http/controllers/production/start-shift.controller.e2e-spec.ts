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

describe("Start shift (E2E)", () => {
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
      providers: [SectorFactory, MachineOperatorFactory, MachineFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    sectorFactory = moduleRef.get(SectorFactory);
    machineOperatorFactory = moduleRef.get(MachineOperatorFactory);
    machineFactory = moduleRef.get(MachineFactory);
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test("[POST] /machines/:machineId/start-shift", async () => {
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

    const machine = await machineFactory.makePrismaMachine({
      sectorId: sector.id,
    });

    const response = await request(app.getHttpServer())
      .post(`/production/machines/${machine.id.toString()}/start-shift`)
      .auth(accessToken, { type: "bearer" })
      .send({
        machineOperatorId: machineOperator.id.toString(),
        reportTime: new Date(),
      });

    expect(response.status).toBe(201);

    const machineOnDatabase = await prisma.machine.findFirst();
    const reportOnDatabase = await prisma.report.findFirst();

    expect(machineOnDatabase).toEqual(
      expect.objectContaining({
        status: "Fora de produção",
        machineOperatorId: machineOperator.id.toString(),
      })
    );

    expect(reportOnDatabase).toEqual(
      expect.objectContaining({
        type: "Shift start",
        machineOperatorId: machineOperator.id.toString(),
        machineId: machine.id.toString(),
      })
    );
  });
});
