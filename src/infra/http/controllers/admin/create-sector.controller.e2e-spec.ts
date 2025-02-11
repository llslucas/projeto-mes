import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { makeSector } from "test/factories/make-sector";

describe("Create sector (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test("[POST] /admin/sectors", async () => {
    const sector = makeSector();

    const response = await request(app.getHttpServer())
      .post("/admin/sectors")
      .send({
        name: sector.name,
        description: sector.description,
      });

    if (response.statusCode !== 201) {
      console.log(response.body);
    }

    expect(response.statusCode).toBe(201);

    const sectorOnDatabase = await prisma.sector.findFirst({
      where: {
        name: sector.name,
      },
    });

    expect(sectorOnDatabase).toBeTruthy();
  });

  afterAll(async () => {
    await app.close();
  });
});
