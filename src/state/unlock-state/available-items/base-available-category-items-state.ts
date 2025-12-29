import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { type IFormatter, NotificationType } from '@shared/index';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { type IScenarioState } from '@state/scenario-state';
import { type IFactionState } from '@state/faction-state';
import { type INotificationsState } from '@state/notifications-state';
import { type IGlobalState } from '@state/global-state';
import { TYPES } from '@state/types';
import { IAvailableCategoryItemsState, IAvailableCategoryItemsSerializedState, type IUnlockState } from '../interfaces';

const { lazyInject } = decorators;

@injectable()
export abstract class BaseAvailableCategoryItemsState<Key extends string = string>
  implements IAvailableCategoryItemsState<Key>
{
  @lazyInject(TYPES.StateUIConnector)
  protected _stateUiConnector!: IStateUIConnector;

  @lazyInject(TYPES.ScenarioState)
  protected _scenarioState!: IScenarioState;

  @lazyInject(TYPES.FactionState)
  protected _factionState!: IFactionState;

  @lazyInject(TYPES.GlobalState)
  protected _globalState!: IGlobalState;

  @lazyInject(TYPES.UnlockState)
  protected _unlockState!: IUnlockState;

  @lazyInject(TYPES.NotificationsState)
  protected _notificationsState!: INotificationsState;

  @lazyInject(TYPES.Formatter)
  protected _formatter!: IFormatter;

  protected _designsTierMap: Map<Key, number>;
  protected _loanedItems: Set<Key>;
  protected _itemsList: Key[];

  constructor() {
    this._designsTierMap = new Map();
    this._loanedItems = new Set();
    this._itemsList = [];

    this._stateUiConnector.registerEventEmitter(this, ['_loanedItems', '_designsTierMap', '_itemsList']);
  }

  listAvailableItems(): Key[] {
    return this._itemsList;
  }

  listDesigns(): Key[] {
    return Array.from(this._designsTierMap.keys());
  }

  listLoanedItems(): Key[] {
    return Array.from(this._loanedItems.values());
  }

  isItemAvailable(itemName: Key, tier: number, level: number): boolean {
    if (!(this._loanedItems.has(itemName) || this._designsTierMap.has(itemName))) {
      return false;
    }

    if (this._globalState.development.level < level) {
      return false;
    }

    const highestAvailableTier = this.getItemHighestAvailableTier(itemName);

    if (tier > highestAvailableTier) {
      return false;
    }

    return true;
  }

  getItemHighestAvailableTier(itemName: Key): number {
    let result = -1;

    if (this._loanedItems.has(itemName)) {
      result = Math.max(result, this._factionState.getFactionLoanTier(this._factionState.currentFaction));
    }

    if (this._designsTierMap.has(itemName)) {
      result = Math.max(result, this.getDesignTier(itemName));
    }

    if (result === -1) {
      throw new Error(`Item ${itemName} is not available`);
    }

    return result;
  }

  getDesignTier(itemName: Key): number {
    if (this._designsTierMap.has(itemName)) {
      return this._designsTierMap.get(itemName)!;
    }

    throw new Error(`Item ${itemName} is not available`);
  }

  unlockDesign(itemName: Key, tier: number, notify: boolean) {
    const existingTier = this._designsTierMap.get(itemName);
    const loaned = this._loanedItems.has(itemName);

    if (existingTier !== undefined && existingTier >= tier) {
      return;
    }

    this._designsTierMap.set(itemName, tier);

    if (existingTier === undefined && !loaned && this.checkRequiredMilestones(itemName)) {
      this._itemsList.push(itemName);
    }

    if (notify) {
      const formattedTier = this._formatter.formatTier(tier);
      this._notificationsState.pushNotification(
        NotificationType.designUnlocked,
        this.makeUnlockNotificationMessage(itemName, formattedTier),
      );
    }
  }

  abstract makeUnlockNotificationMessage(itemName: Key, formattedTier: string): string;

  recalculate() {
    this.clearState(false);

    this.recalculateLoanedItems();
    this.recalculateItemsList();
  }

  async startNewState(): Promise<void> {
    this.clearState(true);
  }

  async deserialize(serializedState: IAvailableCategoryItemsSerializedState<Key>): Promise<void> {
    this.clearState(true);

    Object.entries(serializedState.designs).forEach(([design, tier]) => {
      this._designsTierMap.set(design as Key, tier as number);
    });
  }

  serialize(): IAvailableCategoryItemsSerializedState<Key> {
    return {
      designs: Object.fromEntries(this._designsTierMap.entries()) as Record<Key, number>,
    };
  }

  protected abstract getLoanedItemsFromFaction(): Key[];

  protected abstract checkRequiredMilestones(itemName: Key): boolean;

  private recalculateLoanedItems() {
    const loanedItems = this.getLoanedItemsFromFaction();

    loanedItems.forEach((item) => this._loanedItems.add(item));
  }

  private recalculateItemsList() {
    this._designsTierMap.forEach((tier, design) => {
      if (this.checkRequiredMilestones(design)) {
        this._itemsList.push(design);
      }
    });

    this._loanedItems.forEach((loanedItem) => {
      if (!this._designsTierMap.has(loanedItem) && this.checkRequiredMilestones(loanedItem)) {
        this._itemsList.push(loanedItem);
      }
    });
  }

  private clearState(withDesigns: boolean) {
    this._loanedItems.clear();
    this._itemsList.length = 0;

    if (withDesigns) {
      this._designsTierMap.clear();
    }
  }
}
