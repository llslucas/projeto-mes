import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { makeMachine } from "test/factories/make-machine";
import { SectorFactory } from "test/factories/make-sector";

describe("Create machine (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let sectorFactory: SectorFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [SectorFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    sectorFactory = moduleRef.get(SectorFactory);

    await app.init();
  });

  test("[POST] /admin/machines", async () => {
    const sector = await sectorFactory.makePrismaSector();
    const machine = makeMachine();

    const response = await request(app.getHttpServer())
      .post("/admin/machines")
      .send({
        sectorId: sector.id.toString(),
        name: machine.name,
        description: machine.description,
      });

    if (response.statusCode !== 201) {
      console.log(response.body.errors);
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
