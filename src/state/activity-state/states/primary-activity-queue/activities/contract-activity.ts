import { msg, str } from '@lit/localize';
import { TYPES } from '@state/types';
import { decorators } from '@state/container';
import { type IAutomationState, IContractAssignment } from '@state/automation-state';
import { type IMessageLogState } from '@state/message-log-state';
import { type ISettingsState } from '@state/settings-state';
import {
  DISTRICT_TYPE_REWARD_PARAMETERS,
  DistrictTypeRewardParameter,
  IncomeSource,
  PrimaryActivitiesEvent,
} from '@shared/index';
import { IClone } from '@state/clones-state';
import { IDistrictState } from '@state/city-state';
import { IContractActivity, ISerializedContractActivity } from '../interfaces';
import { PrimaryActivity } from '../primary-activity';
import { PrimaryActivityPerformResult, PrimaryActivityState } from '../types';
import { CONTRACT_TEXTS, CONTRACT_VALIDATION_TEXTS, DISTRICT_NAMES } from '@/texts';
import { ContractValidationResult } from '../../contract-activity-validator';

const { lazyInject } = decorators;

export class ContractActivity extends PrimaryActivity implements IContractActivity {
  @lazyInject(TYPES.AutomationState)
  private _automationState!: IAutomationState;

  @lazyInject(TYPES.SettingsState)
  private _settingsState!: ISettingsState;

  @lazyInject(TYPES.MessageLogState)
  private _messageLogState!: IMessageLogState;

  public readonly type = 'contract';
  public readonly incomeSource = IncomeSource.primaryActivity;

  private _contractAssignment: IContractAssignment;
  private _passedTime: number;

  constructor(serializedActivity: ISerializedContractActivity) {
    super(serializedActivity);

    const assignment = this._automationState.contracts.getContractAssignmentById(
      serializedActivity.contractAssignmentId,
    );
    if (!assignment) {
      throw new Error(
        `Contract activity ${serializedActivity.activityId} missing assignment ${serializedActivity.contractAssignmentId}`,
      );
    }

    this._contractAssignment = assignment;
    this._passedTime = serializedActivity.passedTime;
  }

  get contractAssignment(): IContractAssignment {
    return this._contractAssignment;
  }

  get passedTime(): number {
    return this._passedTime;
  }

  get assignmentId(): string {
    return this._contractAssignment.id;
  }

  get assignedClones(): IClone[] {
    return this._contractAssignment.contract.assignedClones;
  }

  get district(): IDistrictState {
    return this._contractAssignment.contract.district;
  }

  getParameterVisibility(parameter: DistrictTypeRewardParameter): boolean {
    return this._contractAssignment.contract.getParameterVisibility(parameter);
  }

  getParameterGrowth(parameter: DistrictTypeRewardParameter): number {
    if (this.state !== PrimaryActivityState.active) {
      return 0;
    }

    return this.getParameterReward(parameter) / this._contractAssignment.contract.completionTime;
  }

  getActivityAddedMessage(): string {
    const contractName = CONTRACT_TEXTS[this._contractAssignment.contract.contractName].title();
    const districtName = DISTRICT_NAMES[this._contractAssignment.contract.district.name]();
    const cloneNames = this.assignedClones.map((clone) => clone.name).join(', ');

    return msg(
      str`Primary activity for contract "${contractName}" in district "${districtName}" assigned to ${cloneNames} has been added to the primary activity queue`,
    );
  }

  getActivityCancelledMessage(): string {
    const contractName = CONTRACT_TEXTS[this._contractAssignment.contract.contractName].title();
    const districtName = DISTRICT_NAMES[this._contractAssignment.contract.district.name]();
    const cloneNames = this.assignedClones.map((clone) => clone.name).join(', ');

    return msg(
      str`Primary activity for contract "${contractName}" in district "${districtName}" assigned to ${cloneNames} has been cancelled`,
    );
  }

  start(): boolean {
    if (this.state === PrimaryActivityState.active) {
      return true;
    }

    if (this.state === PrimaryActivityState.toBeRemoved) {
      return false;
    }

    const contractName = CONTRACT_TEXTS[this._contractAssignment.contract.contractName].title();
    const districtName = DISTRICT_NAMES[this._contractAssignment.contract.district.name]();
    const cloneNames = this.assignedClones.map((clone) => clone.name).join(', ');

    if (
      this._contractAssignment.contract.district.counters.contracts.getAvailableAmount(
        this._contractAssignment.contract.contractName,
      ) <= 0
    ) {
      this.state = PrimaryActivityState.toBeRemoved;

      this._messageLogState.postMessage(
        PrimaryActivitiesEvent.primaryActivityFinished,
        msg(
          str`Primary activity for contract "${contractName}" in district "${districtName}" assigned to ${cloneNames} has been finished because no more available contracts are left`,
        ),
      );

      return false;
    }

    const validationResult = this._activityState.contractActivityValidator.validate(this._contractAssignment.contract);

    if (validationResult !== ContractValidationResult.valid) {
      this.state = PrimaryActivityState.toBeRemoved;

      const validationText = CONTRACT_VALIDATION_TEXTS[validationResult]();

      this._messageLogState.postMessage(
        PrimaryActivitiesEvent.primaryActivityFinished,
        msg(
          str`Primary activity for contract "${contractName}" in district "${districtName}" assigned to ${cloneNames} has been stopped, reason "${validationText}"`,
        ),
      );

      return false;
    }

    this.initPerformance();

    return true;
  }

  perform(): PrimaryActivityPerformResult {
    this._passedTime += this._settingsState.updateInterval;

    if (this._passedTime >= this._contractAssignment.contract.completionTime) {
      this.state = PrimaryActivityState.inactive;

      return PrimaryActivityPerformResult.reward;
    }

    return PrimaryActivityPerformResult.continue;
  }

  serialize(): ISerializedContractActivity {
    return {
      ...super.serialize(),
      contractAssignmentId: this._contractAssignment.id,
      passedTime: this._passedTime,
    };
  }

  private initPerformance() {
    this._contractAssignment.contract.district.counters.contracts.useContract(
      this._contractAssignment.contract.contractName,
    );
    this.state = PrimaryActivityState.active;
    this._passedTime = 0;

    for (const parameter of DISTRICT_TYPE_REWARD_PARAMETERS) {
      const value = this._contractAssignment.contract.calculateParameterDelta(parameter);

      this._parameterRewardsMap.set(parameter, value);
    }
  }
}
