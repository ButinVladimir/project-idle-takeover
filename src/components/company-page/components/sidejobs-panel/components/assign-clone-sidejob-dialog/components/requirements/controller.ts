import { ISidejob } from '@state/activity-state';
import { Attribute, BaseController, Skill } from '@shared/index';

export class AssignCloneSidejobDialogRequirementsController extends BaseController {
  validateAttribute(sidejob: ISidejob, attribute: Attribute): boolean {
    return this.activityState.sidejobActivityValidator.validateAttribute(sidejob, attribute);
  }

  validateSkill(sidejob: ISidejob, skill: Skill): boolean {
    return this.activityState.sidejobActivityValidator.validateSkill(sidejob, skill);
  }
}
