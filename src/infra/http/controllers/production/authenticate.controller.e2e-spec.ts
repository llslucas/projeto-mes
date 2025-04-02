import { AppModule } from "@/infra/app.module";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { Test } from "@nestjs/testing";
import { MachineOperatorFactory } from "test/factories/make-machine-operator";
import { DatabaseModule } from "@/infra/database/database.module";
import { SectorFactory } from "test/factories/make-sector";

describe("Create work order (E2E)", () => {
  let app: INestApplication;
  let machineOperatorFactory: MachineOperatorFactory;
  let sectorFactory: SectorFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MachineOperatorFactory, SectorFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    machineOperatorFactory = moduleRef.get(MachineOperatorFactory);
    sectorFactory = moduleRef.get(SectorFactory);

    await app.init();
  });

  test("[POST] /sessions", async () => {
    const sector = await sectorFactory.makePrismaSector();

    const machineOperator =
      await machineOperatorFactory.makePrismaMachineOperator({
        sectorId: sector.id,
      });

    const response = await request(app.getHttpServer())
      .post("/production/sessions")
      .send({
        operatorNumber: machineOperator.number,
      });

    if (response.statusCode !== 201) {
      console.log(response.body.errors);
    }

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("accessToken");
  });

  afterAll(async () => {
    await app.close();
  });
});
