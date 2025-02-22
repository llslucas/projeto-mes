import { AppModule } from "@/infra/app.module";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { Test } from "@nestjs/testing";
import { DatabaseModule } from "@/infra/database/database.module";
import { MachineFactory } from "test/factories/make-machine";
import { MachineOperatorFactory } from "test/factories/make-machine-operator";
import { JwtService } from "@nestjs/jwt";
import { SectorFactory } from "test/factories/make-sector";

describe("Fetch machines (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let machineFactory: MachineFactory;
  let sectorFactory: SectorFactory;
  let machineOperatorFactory: MachineOperatorFactory;
  let accessToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MachineFactory, MachineOperatorFactory, SectorFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    machineFactory = moduleRef.get(MachineFactory);
    sectorFactory = moduleRef.get(SectorFactory);
    machineOperatorFactory = moduleRef.get(MachineOperatorFactory);

    await app.init();

    const sectors = await Promise.all([
      sectorFactory.makePrismaSector(),
      sectorFactory.makePrismaSector(),
    ]);

    await Promise.all([
      machineFactory.makePrismaMachine({
        sectorId: sectors[0].id,
        name: "Teste 1",
      }),
      machineFactory.makePrismaMachine({
        sectorId: sectors[0].id,
        name: "Teste 2",
      }),
      machineFactory.makePrismaMachine({
        sectorId: sectors[1].id,
        name: "Another Machine",
      }),
    ]);

    const machineOperator =
      await machineOperatorFactory.makePrismaMachineOperator({
        sectorId: sectors[0].id,
      });

    accessToken = jwt.sign({
      sub: machineOperator.id.toString(),
    });
  });

  test("[GET] /machines", async () => {
    const response = await request(app.getHttpServer())
      .get("/production/machines")
      .auth(accessToken, { type: "bearer" })
      .send();

    if (response.statusCode !== 200) {
      console.log(response.body);
    }

    expect(response.statusCode).toBe(200);
    expect(response.body.machines).toHaveLength(2);
  });
});
