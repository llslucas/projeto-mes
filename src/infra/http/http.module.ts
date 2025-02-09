import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { ProductionModule } from "./controllers/production.module";
import { AdminModule } from "./controllers/admin.module";

@Module({
  imports: [
    ProductionModule,
    AdminModule,
    RouterModule.register([
      {
        path: "admin",
        module: AdminModule,
      },
      {
        path: "production",
        module: ProductionModule,
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class HttpModule {}
