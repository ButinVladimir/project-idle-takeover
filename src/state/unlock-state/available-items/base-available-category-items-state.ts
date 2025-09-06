import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { type IScenarioState } from '@state/scenario-state';
import { type IFactionState } from '@state/faction-state';
import { TYPES } from '@state/types';
import {
  IAvailableCategoryItemsState,
  IAvailableCategoryItemsSerializedState,
  type IUnlockState,
} from '../interfaces';

const { lazyInject } = decorators;

@injectable()
export abstract class BaseAvailableCategoryItemsState<Key extends string = string> implements IAvailableCategoryItemsState<Key> {
  @lazyInject(TYPES.StateUIConnector)
  protected _stateUiConnector!: IStateUIConnector;

  @lazyInject(TYPES.ScenarioState)
  protected _scenarioState!: IScenarioState;

  @lazyInject(TYPES.FactionState)
  protected _factionState!: IFactionState;

  @lazyInject(TYPES.UnlockState)
  protected _unlockState!: IUnlockState;

  protected _loanedItems: Set<Key>;
  protected _designsTierMap: Map<Key, number>;
  protected _itemsList: Key[];

  constructor() {
    this._loanedItems = new Set();
    this._designsTierMap = new Map();
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

  isItemAvailable(itemName: Key, tier: number): boolean {
    if (!(this._loanedItems.has(itemName) || this._designsTierMap.has(itemName))) {
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
      result = Math.max(result, this._designsTierMap.get(itemName)!);
    }

    if (result === -1) {
      throw new Error(`Item ${itemName} is not available`);
    }

    return result;
  }

  unlockDesign(itemName: Key, tier: number) {
    const existingTier = this._designsTierMap.get(itemName);
    const loaned = this._loanedItems.has(itemName);

    if (existingTier !== undefined && existingTier >= tier) {
      return;
    }

    this._designsTierMap.set(itemName, tier);

    if (existingTier === undefined && !loaned && this.checkRequiredFeatures(itemName)) {
      this._itemsList.push(itemName);
    }
  }

  recalculate() {
    this.clearState();

    this.recalculateLoanedItems();
    this.recalculateItemsList();
  }

  async startNewState(): Promise<void> {
    this.clearState();
    this._designsTierMap.clear();
  }

  async deserialize(serializedState: IAvailableCategoryItemsSerializedState<Key>): Promise<void> {
    this.clearState();
    this._designsTierMap.clear();

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

  protected abstract checkRequiredFeatures(itemName: Key): boolean;

  private recalculateLoanedItems() {
    const loanedItems = this.getLoanedItemsFromFaction();

    loanedItems.forEach((item) => this._loanedItems.add(item));
  }

  private recalculateItemsList() {
    this._loanedItems.forEach((loanedItem) => {
      if (this.checkRequiredFeatures(loanedItem)) {
        this._itemsList.push(loanedItem);
      }
    });

    this._designsTierMap.forEach((tier, design) => {
      if (!this._loanedItems.has(design) && this.checkRequiredFeatures(design)) {
        this._itemsList.push(design);
      }
    });
  }

  private clearState() {
    this._loanedItems.clear();
    this._itemsList.length = 0;
  }
}
