import { inject, injectable } from 'inversify';
import { v4 as uuid } from 'uuid';
import { msg, str } from '@lit/localize';
import padStart from 'lodash/padStart';
import { decorators } from '@state/container';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { type IGlobalState } from '@state/global-state';
import { type IMessageLogState } from '@state/message-log-state';
import { TYPES } from '@state/types';
import {
  ClonesEvent,
  PurchaseType,
  moveElementInArray,
  removeElementsFromArray,
  type IFormatter,
  typedNames,
} from '@shared/index';
import { CLONE_TEMPLATE_TEXTS, CLONE_NAMES } from '@texts/index';
import { type IActivityState } from '@state/activity-state';
import { type IAutomationState } from '@state/automation-state';
import { type IClonesState } from '../../interfaces';
import { IClone } from '../clone-factory/interfaces/clone';
import {
  type IOwnedClonesLevelUpgrader,
  IOwnedClonesSerializedState,
  IOwnedClonesState,
  type IOwnedClonesValidator,
  IPurchaseCloneArgs,
} from './interfaces';
import { IMakeCloneParameters } from '../clone-factory';
import { CloneValidationResult } from './types';

const { lazyInject } = decorators;

@injectable()
export class OwnedClonesState implements IOwnedClonesState {
  @lazyInject(TYPES.ClonesState)
  private _clonesState!: IClonesState;

  @lazyInject(TYPES.ActivityState)
  private _activityState!: IActivityState;

  @lazyInject(TYPES.AutomationState)
  private _automationState!: IAutomationState;

  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  @lazyInject(TYPES.MessageLogState)
  private _messageLogState!: IMessageLogState;

  @lazyInject(TYPES.Formatter)
  private _formatter!: IFormatter;

  @inject(TYPES.OwnedClonesLevelUpgrader)
  private _levelUpgrader!: IOwnedClonesLevelUpgrader;

  @inject(TYPES.OwnedClonesValidator)
  private _validator!: IOwnedClonesValidator;

  private _clonesList: IClone[];
  private _clonesMap: Map<string, IClone>;

  constructor() {
    this._clonesList = [];
    this._clonesMap = new Map<string, IClone>();

    this._stateUiConnector.registerEventEmitter(this, ['_clonesList']);
  }

  get levelUpgrader() {
    return this._levelUpgrader;
  }

  get validator() {
    return this._validator;
  }

  listClones(): IClone[] {
    return this._clonesList;
  }

  getCloneById(id: string): IClone | undefined {
    return this._clonesMap.get(id);
  }

  purchaseClone(cloneArgs: IPurchaseCloneArgs): boolean {
    if (this._validator.validateClone(cloneArgs) !== CloneValidationResult.valid) {
      return false;
    }
    const cost = this._validator.calculateCloneCost(cloneArgs.templateName, cloneArgs.tier, cloneArgs.level);

    const bought = this._globalState.money.purchase(cost, PurchaseType.clones, this.handlePurhaseClone(cloneArgs));

    return bought;
  }

  deleteClone(id: string): void {
    const clone: IClone | undefined = this.getCloneById(id);

    if (clone) {
      this.handleDeleteClone(clone);

      this._messageLogState.postMessage(ClonesEvent.cloneDeleted, msg(str`Clone "${clone.name}" has been deleted`));
    }

    this._globalState.synchronization.recalculate();
    this._activityState.requestReassignment();
  }

  deleteClones(ids: string[]): void {
    for (const id of ids) {
      const clone: IClone | undefined = this.getCloneById(id);

      if (clone) {
        this.handleDeleteClone(clone);
      }
    }

    this._messageLogState.postMessage(ClonesEvent.displayedClonesDeleted, msg('Displayed clones have been deleted'));

    this._globalState.synchronization.recalculate();
    this._activityState.requestReassignment();
  }

  recalculateClones(): void {
    const sharedExperience = this._globalState.experienceShare.sharedExperience;

    for (const clone of this._clonesList) {
      clone.increaseExperience(sharedExperience, false);
      clone.recalculate();
    }

    this._globalState.experienceShare.resetExperience();
  }

  moveClone(id: string, newPosition: number): void {
    const oldPosition = this._clonesList.findIndex((clone) => clone.id === id);

    if (oldPosition >= 0) {
      moveElementInArray(this._clonesList, oldPosition, newPosition);
    }
  }

  generateCloneName(): string {
    const namePart = CLONE_NAMES[this._globalState.random.choice(typedNames.clones)]();

    const serialNumber = this._globalState.random.randRange(0, 9999);
    const serialNumberPart = padStart(serialNumber.toString(), 4, '0');

    return `${namePart}#${serialNumberPart}`;
  }

  async startNewState(): Promise<void> {
    this.clearState();
    this.recalculateClones();
  }

  async deserialize(serializedState: IOwnedClonesSerializedState): Promise<void> {
    this.clearState();

    serializedState.clones.forEach((makeCloneParameters) => {
      const clone = this._clonesState.cloneFactory.makeClone(makeCloneParameters);
      this._clonesList.push(clone);
      this._clonesMap.set(clone.id, clone);
    });

    this.recalculateClones();
  }

  serialize(): IOwnedClonesSerializedState {
    return {
      clones: this._clonesList.map(this.serializeClone),
    };
  }

  private serializeClone = (clone: IClone): IMakeCloneParameters => {
    return clone.serialize();
  };

  private clearState() {
    for (const clone of this._clonesList) {
      clone.removeAllEventListeners();
    }

    this._clonesList.length = 0;
    this._clonesMap.clear();
  }

  private addClone(clone: IClone) {
    if (!this._clonesMap.has(clone.id)) {
      this._clonesList.push(clone);
    }

    this._clonesMap.set(clone.id, clone);
  }

  private handlePurhaseClone = (args: IPurchaseCloneArgs) => () => {
    const clone = this._clonesState.cloneFactory.makeClone({
      id: uuid(),
      name: args.name,
      templateName: args.templateName,
      tier: args.tier,
      level: args.level,
      experience: 0,
      autoUpgradeEnabled: true,
    });

    this.addClone(clone);

    this._globalState.synchronization.recalculate();

    const formattedLevel = this._formatter.formatLevel(clone.level);
    const formattedTier = this._formatter.formatTier(clone.tier);

    this._messageLogState.postMessage(
      ClonesEvent.clonePurchased,
      msg(
        str`Clone "${clone.name}" with template "${CLONE_TEMPLATE_TEXTS[clone.templateName].title()}", tier ${formattedTier} and level ${formattedLevel} has been purchased`,
      ),
    );
  };

  private deleteCloneRelatedObjects(clone: IClone) {
    const sidejob = this._activityState.sidejobsActivity.getActivityByCloneId(clone.id);

    if (sidejob) {
      this._activityState.sidejobsActivity.cancelActivity(sidejob.id);
    }

    this._automationState.contracts.removeCloneFromAssignments(clone.id);
  }

  private handleDeleteClone(clone: IClone) {
    const index = this._clonesList.findIndex((clone) => clone.id === clone.id);

    if (index >= 0) {
      removeElementsFromArray(this._clonesList, index, 1);
    }

    if (clone) {
      clone.removeAllEventListeners();

      this._clonesMap.delete(clone.id);
      this.deleteCloneRelatedObjects(clone);
    }
  }
}
