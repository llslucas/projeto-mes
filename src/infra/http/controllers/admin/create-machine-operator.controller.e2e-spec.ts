import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { MachineFactory } from "test/factories/make-machine";
import { makeMachineOperator } from "test/factories/make-machine-operator";
import { SectorFactory } from "test/factories/make-sector";

describe("Create machine operator (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let sectorFactory: SectorFactory;
  let machineFactory: MachineFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [SectorFactory, MachineFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    sectorFactory = moduleRef.get(SectorFactory);
    machineFactory = moduleRef.get(MachineFactory);

    await app.init();
  });

  test("[POST] /admin/machine-operators", async () => {
    const sector = await sectorFactory.makePrismaSector();

    const machine = await machineFactory.makePrismaMachine({
      sectorId: sector.id,
    });

    const machineOperator = makeMachineOperator();

    const response = await request(app.getHttpServer())
      .post("/admin/machine-operators")
      .send({
        sectorId: sector.id.toString(),
        machineId: machine.id.toString(),
        name: machineOperator.name,
        number: machineOperator.number,
      });

    if (response.statusCode !== 201) {
      console.log(response.body);
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
