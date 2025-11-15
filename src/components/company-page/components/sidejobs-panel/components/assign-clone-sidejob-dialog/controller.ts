import { IAssignSidejobArguments, ISidejob } from '@state/activity-state';
import { IClone } from '@state/clones-state';
import { BaseController } from '@shared/index';
import { IDistrictState } from '@state/city-state';

export class AssignCloneSidejobDialogController extends BaseController {
  private _sidejob?: ISidejob;

  hostDisconnected() {
    super.hostDisconnected();

    this.deleteSidejob();
  }

  listClones(): IClone[] {
    return this.clonesState.ownedClones.listClones();
  }

  listAvailableSidejobs(): string[] {
    return this.unlockState.activities.sidejobs.listAvailableActivities();
  }

  listAvailableDistricts(): IDistrictState[] {
    return this.cityState.listAvailableDistricts();
  }

  getTotalConnectivity(districtIndex: number): number {
    return this.cityState.getDistrictState(districtIndex).parameters.connectivity.totalValue;
  }

  getRequiredConnectivity(sidejobName: string): number {
    return this.activityState.sidejobs.getConnectivityRequirement(sidejobName);
  }

  getSidejob(args: IAssignSidejobArguments): ISidejob {
    if (
      this._sidejob?.assignedClone?.id !== args.assignedCloneId ||
      this._sidejob?.sidejobName !== args.sidejobName ||
      this._sidejob?.district.index !== args.districtIndex
    ) {
      this.deleteSidejob();

      this._sidejob = this.activityState.sidejobs.makeSidejob({
        id: 'temporary',
        ...args,
      });
    }

    return this._sidejob;
  }

  getExistingSidejobByClone(cloneId?: string): ISidejob | undefined {
    if (!cloneId) {
      return undefined;
    }

    return this.activityState.sidejobs.getSidejobByCloneId(cloneId);
  }

  assignClone(args: IAssignSidejobArguments) {
    this.activityState.sidejobs.assignSidejob(args);
  }

  private deleteSidejob() {
    if (this._sidejob) {
      this._sidejob.removeAllEventListeners();
    }
  }
}
