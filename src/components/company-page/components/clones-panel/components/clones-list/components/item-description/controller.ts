import { IClone } from '@state/company-state/states/clone-factory/interfaces/clone';
import { BaseController } from '@shared/base-controller';

export class ClonesListItemDescriptionController extends BaseController {
  getCloneSynchronization(clone: IClone): number {
    return this.companyState.clones.calculateCloneSynchronization(clone.templateName, clone.tier);
  }
}
