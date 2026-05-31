import { IContract } from '@state/activity-state';
import { Attribute, BaseController, Skill } from '@shared/index';

export class AssignClonesContractDialogRequirementsController extends BaseController {
  getAttributeRequirement(contract: IContract, attribute: Attribute): number {
    return this.activityState.contractActivityValidator.getAttributeRequirement(
      contract.contractName,
      contract.district,
      attribute,
    );
  }

  getAttributeRequiredTeamSize(contract: IContract, attribute: Attribute): number {
    return this.activityState.contractActivityValidator.getAttributeRequiredTeamSize(contract.contractName, attribute);
  }

  getSkillRequirement(contract: IContract, skill: Skill): number {
    return this.activityState.contractActivityValidator.getSkillRequirement(
      contract.contractName,
      contract.district,
      skill,
    );
  }

  getSkillRequiredTeamSize(contract: IContract, skill: Skill): number {
    return this.activityState.contractActivityValidator.getSkillRequiredTeamSize(contract.contractName, skill);
  }

  validateAttribute(contract: IContract, attribute: Attribute): boolean {
    return this.activityState.contractActivityValidator.validateAttribute(
      contract.contractName,
      contract.district,
      contract.assignedClones,
      attribute,
    );
  }

  validateSkill(contract: IContract, skill: Skill): boolean {
    return this.activityState.contractActivityValidator.validateSkill(
      contract.contractName,
      contract.district,
      contract.assignedClones,
      skill,
    );
  }

  getAttributeValidTeamSize(contract: IContract, attribute: Attribute): number {
    return this.activityState.contractActivityValidator.getAttributeValidTeamSize(
      contract.contractName,
      contract.district,
      contract.assignedClones,
      attribute,
    );
  }

  getSkillValidTeamSize(contract: IContract, skill: Skill): number {
    return this.activityState.contractActivityValidator.getSkillValidTeamSize(
      contract.contractName,
      contract.district,
      contract.assignedClones,
      skill,
    );
  }
}
