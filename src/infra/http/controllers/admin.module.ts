import { Module } from "@nestjs/common";
import { CreateSectorUseCase } from "@/domain/mes/application/use-cases/create-sector";
import { CreateMachineUseCase } from "@/domain/mes/application/use-cases/create-machine";
import { CreateSellOrderUseCase } from "@/domain/mes/application/use-cases/create-sell-order";
import { CreateWorkOrderUseCase } from "@/domain/mes/application/use-cases/create-work-order";
import { CreateMachineOperatorUseCase } from "@/domain/mes/application/use-cases/create-machine-operator";
import { CreateWorkOrderOperationUseCase } from "@/domain/mes/application/use-cases/create-work-order-operation";
import { DatabaseModule } from "@/infra/database/database.module";
import { CryptografyModule } from "@/infra/cryptografy/cryptografy.module";
import { CreateSectorController } from "./admin/create-sector.controller";
import { CreateMachineController } from "./admin/create-machine.controller";
import { CreateMachineOperatorController } from "./admin/create-machine-operator.controller";

@Module({
  imports: [DatabaseModule, CryptografyModule],
  controllers: [
    CreateSectorController,
    CreateMachineController,
    CreateMachineOperatorController,
  ],
  providers: [
    CreateSectorUseCase,
    CreateMachineUseCase,
    CreateMachineOperatorUseCase,
    CreateSellOrderUseCase,
    CreateWorkOrderUseCase,
    CreateWorkOrderOperationUseCase,
  ],
})
export class AdminModule {}
