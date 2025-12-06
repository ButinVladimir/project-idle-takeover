import { IContract } from '@state/activity-state';
import { Attribute, BaseController, Skill } from '@shared/index';

export class AssignClonesContractDialogRequirementsController extends BaseController {
  validateAttribute(contract: IContract, attribute: Attribute): boolean {
    return this.activityState.contractActivityValidator.validateAttribute(contract, attribute);
  }

  validateSkill(contract: IContract, skill: Skill): boolean {
    return this.activityState.contractActivityValidator.validateSkill(contract, skill);
  }

  getAttributeValidTeamSize(contract: IContract, attribute: Attribute): number {
    return this.activityState.contractActivityValidator.getAttributeValidTeamSize(contract, attribute);
  }

  getSkillValidTeamSize(contract: IContract, skill: Skill): number {
    return this.activityState.contractActivityValidator.getSkillValidTeamSize(contract, skill);
  }
}
