import { Module } from "@nestjs/common";
import { EndSetupUseCase } from "@/domain/mes/application/use-cases/end-setup";
import { EndShiftUseCase } from "@/domain/mes/application/use-cases/end-shift";
import { StartSetupUseCase } from "@/domain/mes/application/use-cases/start-setup";
import { StartShiftUseCase } from "@/domain/mes/application/use-cases/start-shift";
import { FetchSectorsUseCase } from "@/domain/mes/application/use-cases/fetch-sectors";
import { EndProductionUseCase } from "@/domain/mes/application/use-cases/end-production";
import { FetchMachinesUseCase } from "@/domain/mes/application/use-cases/fetch-machines";
import { StartProductionUseCase } from "@/domain/mes/application/use-cases/start-production";
import { ReportProductionUseCase } from "@/domain/mes/application/use-cases/report-production";
import { FetchWorkOrderOperationsUseCase } from "@/domain/mes/application/use-cases/fetch-work-order-operations";
import { AuthenticateMachineOperatorUseCase } from "@/domain/mes/application/use-cases/authenticate-machine-operator";
import { DatabaseModule } from "@/infra/database/database.module";
import { CryptografyModule } from "@/infra/cryptografy/cryptografy.module";
import { AuthenticateController } from "./production/authenticate.controller";
import { FetchSectorsController } from "./production/fetch-sectors.controller";
import { FetchMachinesController } from "./production/fetch-machines.controller";
import { FetchWorkOrderOperationsController } from "./production/fetch-work-order-operations.controller";
import { StartShiftController } from "./production/start-shift.controller";
import { StartProductionController } from "./production/start-production.controller";
import { StartSetupController } from "./production/start-setup.controller";
import { ReportProductionController } from "./production/report-production.controller";
import { EndSetupController } from "./production/end-setup.controller";
import { EndProductionController } from "./production/end-production.controller";
import { EndShiftController } from "./production/end-shift.controller";

@Module({
  imports: [DatabaseModule, CryptografyModule],
  controllers: [
    AuthenticateController,
    FetchSectorsController,
    FetchMachinesController,
    FetchWorkOrderOperationsController,
    StartShiftController,
    StartProductionController,
    StartSetupController,
    ReportProductionController,
    EndSetupController,
    EndProductionController,
    EndShiftController,
  ],
  providers: [
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
    StartShiftUseCase,
  ],
})
export class ProductionModule {}
