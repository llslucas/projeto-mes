import { AppModule } from "@/infra/app.module";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { Test } from "@nestjs/testing";
import { DatabaseModule } from "@/infra/database/database.module";
import { SectorFactory } from "test/factories/make-sector";
import { MachineOperatorFactory } from "test/factories/make-machine-operator";
import { JwtService } from "@nestjs/jwt";

describe("Fetch sectors (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let sectorFactory: SectorFactory;
  let machineOperatorFactory: MachineOperatorFactory;
  let accessToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [SectorFactory, MachineOperatorFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    sectorFactory = moduleRef.get(SectorFactory);
    machineOperatorFactory = moduleRef.get(MachineOperatorFactory);

    await app.init();

    const sectors = await Promise.all([
      sectorFactory.makePrismaSector({
        name: "Teste 1",
      }),
      sectorFactory.makePrismaSector({
        name: "Teste 2",
      }),
      sectorFactory.makePrismaSector({
        name: "Another Sector",
      }),
    ]);

    const machineOperator =
      await machineOperatorFactory.makePrismaMachineOperator({
        sectorId: sectors[0].id,
      });

    accessToken = jwt.sign({
      sub: machineOperator.id.toString(),
      role: "OPERATOR",
    });
  });

  test("[GET] /sectors", async () => {
    const response = await request(app.getHttpServer())
      .get("/production/sectors")
      .auth(accessToken, { type: "bearer" })
      .send();

    if (response.statusCode !== 200) {
      console.log(response.body);
    }

    expect(response.statusCode).toBe(200);
    expect(response.body.sectors).toHaveLength(3);
  });

  test("[GET] /sectors?search=Teste", async () => {
    const response = await request(app.getHttpServer())
      .get("/production/sectors?search=Teste")
      .auth(accessToken, { type: "bearer" })
      .send();

    if (response.statusCode !== 200) {
      console.log(response.body);
    }

    expect(response.statusCode).toBe(200);
    expect(response.body.sectors).toHaveLength(2);
  });

  afterAll(async () => {
    await app.close();
  });
});
