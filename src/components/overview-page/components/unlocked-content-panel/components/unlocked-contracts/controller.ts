import { BaseController } from '@shared/index';

export class OverviewUnlockedContractsController extends BaseController {
  listUnlockedContracts(): string[] {
    return this.unlockState.activities.contracts.listUnlockedActivities();
  }
}
