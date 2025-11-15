import { inject, injectable } from 'inversify';
import { v4 as uuid } from 'uuid';
import { msg, str } from '@lit/localize';
import padStart from 'lodash/padStart';
import { decorators } from '@state/container';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { type IGlobalState } from '@state/global-state';
import { type IMessageLogState } from '@state/message-log-state';
import { type IUnlockState } from '@state/unlock-state';
import { TYPES } from '@state/types';
import {
  ClonesEvent,
  Feature,
  PurchaseType,
  calculateTierMultiplier,
  calculateTierPower,
  moveElementInArray,
  removeElementsFromArray,
  reverseTierPower,
  type IFormatter,
  typedNames,
} from '@shared/index';
import { CLONE_TEMPLATE_TEXTS, CLONE_NAMES } from '@texts/index';
import { type IActivityState } from '@state/activity-state';
import { type IClonesState } from '../../interfaces';
import { IClone } from '../clone-factory/interfaces/clone';
import {
  type IOwnedClonesLevelUpgrader,
  IOwnedClonesSerializedState,
  IOwnedClonesState,
  IPurchaseCloneArgs,
} from './interfaces';
import { IMakeCloneParameters, typedCloneTemplates } from '../clone-factory';

const { lazyInject } = decorators;

@injectable()
export class OwnedClonesState implements IOwnedClonesState {
  @lazyInject(TYPES.ClonesState)
  private _clonesState!: IClonesState;

  @lazyInject(TYPES.ActivityState)
  private _activityState!: IActivityState;

  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  @lazyInject(TYPES.UnlockState)
  private _unlockState!: IUnlockState;

  @lazyInject(TYPES.MessageLogState)
  private _messageLogState!: IMessageLogState;

  @lazyInject(TYPES.Formatter)
  private _formatter!: IFormatter;

  @inject(TYPES.OwnedClonesLevelUpgrader)
  private _levelUpgrader!: IOwnedClonesLevelUpgrader;

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

  listClones(): IClone[] {
    return this._clonesList;
  }

  getCloneById(id: string): IClone | undefined {
    return this._clonesMap.get(id);
  }

  calculateCloneCost(templateName: string, tier: number, level: number): number {
    return calculateTierPower(level, tier, typedCloneTemplates[templateName].cost);
  }

  calculateCloneLevelFromMoney(templateName: string, tier: number, money: number): number {
    return Math.min(
      reverseTierPower(money, tier, typedCloneTemplates[templateName].cost),
      this._globalState.development.level,
    );
  }

  calculateCloneSynchronization(templateName: string, tier: number): number {
    const template = typedCloneTemplates[templateName];

    return Math.ceil(
      template.synchronization.multiplier * calculateTierMultiplier(tier, template.synchronization.baseTier),
    );
  }

  purchaseClone(args: IPurchaseCloneArgs): boolean {
    if (!this._unlockState.features.isFeatureUnlocked(Feature.companyManagement)) {
      return false;
    }

    if (!this._unlockState.items.cloneTemplates.isItemAvailable(args.templateName, args.tier, args.level)) {
      return false;
    }

    if (!args.name) {
      return false;
    }

    const synchronization = this.calculateCloneSynchronization(args.templateName, args.tier);

    if (synchronization > this._globalState.synchronization.availableValue) {
      return false;
    }

    const cost = this.calculateCloneCost(args.templateName, args.tier, args.level);

    const bought = this._globalState.money.purchase(cost, PurchaseType.clones, this.handlePurhaseClone(args));

    return bought;
  }

  toggleAllClonesAutoupgrade(active: boolean): void {
    for (const clone of this._clonesList) {
      clone.autoUpgradeEnabled = active;
    }
  }

  deleteClone(id: string): void {
    const clone: IClone | undefined = this.getCloneById(id);
    const index = this._clonesList.findIndex((clone) => clone.id === id);

    if (index >= 0) {
      removeElementsFromArray(this._clonesList, index, 1);
    }

    if (clone) {
      clone.removeAllEventListeners();

      this._clonesMap.delete(id);
      this.deleteCloneRelatedObjects(clone);

      this._messageLogState.postMessage(ClonesEvent.cloneDeleted, msg(str`Clone "${clone.name}" has been deleted`));
    }

    this._globalState.synchronization.requestRecalculation();

    this._activityState.requestReassignment();
  }

  deleteAllClones(): void {
    this.clearState();
    this._activityState.sidejobs.cancelAllSidejobs();

    this._messageLogState.postMessage(ClonesEvent.allClonesDeleted, msg('All clones have been deleted'));

    this._globalState.synchronization.requestRecalculation();

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

    this._globalState.synchronization.requestRecalculation();
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
    const sidejob = this._activityState.sidejobs.getSidejobByCloneId(clone.id);

    if (sidejob) {
      this._activityState.sidejobs.cancelSidejob(sidejob.id);
    }
  }
}
