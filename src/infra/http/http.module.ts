import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { CryptografyModule } from "../cryptografy/cryptografy.module";
import { EndSetupUseCase } from "@/domain/mes/application/use-cases/end-setup";
import { EndShiftUseCase } from "@/domain/mes/application/use-cases/end-shift";
import { StartSetupUseCase } from "@/domain/mes/application/use-cases/start-setup";
import { StartShiftUseCase } from "@/domain/mes/application/use-cases/start-shift";
import { CreateSectorUseCase } from "@/domain/mes/application/use-cases/create-sector";
import { FetchSectorsUseCase } from "@/domain/mes/application/use-cases/fetch-sectors";
import { CreateMachineUseCase } from "@/domain/mes/application/use-cases/create-machine";
import { EndProductionUseCase } from "@/domain/mes/application/use-cases/end-production";
import { FetchMachinesUseCase } from "@/domain/mes/application/use-cases/fetch-machines";
import { CreateSellOrderUseCase } from "@/domain/mes/application/use-cases/create-sell-order";
import { CreateWorkOrderUseCase } from "@/domain/mes/application/use-cases/create-work-order";
import { StartProductionUseCase } from "@/domain/mes/application/use-cases/start-production";
import { ReportProductionUseCase } from "@/domain/mes/application/use-cases/report-production";
import { CreateMachineOperatorUseCase } from "@/domain/mes/application/use-cases/create-machine-operator";
import { CreateWorkOrderOperationUseCase } from "@/domain/mes/application/use-cases/create-work-order-operation";
import { FetchWorkOrderOperationsUseCase } from "@/domain/mes/application/use-cases/fetch-work-order-operations";
import { AuthenticateMachineOperatorUseCase } from "@/domain/mes/application/use-cases/authenticate-machine-operator";

@Module({
  imports: [DatabaseModule, CryptografyModule],
  controllers: [],
  providers: [
    CreateSectorUseCase,
    CreateMachineUseCase,
    CreateMachineOperatorUseCase,
    CreateSellOrderUseCase,
    CreateWorkOrderUseCase,
    CreateWorkOrderOperationUseCase,
    StartProductionUseCase,
    ReportProductionUseCase,
    EndProductionUseCase,
    StartSetupUseCase,
    EndSetupUseCase,
    StartShiftUseCase,
    EndShiftUseCase,
    FetchSectorsUseCase,
    FetchWorkOrderOperationsUseCase,
    FetchMachinesUseCase,
    AuthenticateMachineOperatorUseCase,
  ],
})
export class HttpModule {}
