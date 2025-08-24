import { injectable } from 'inversify';
import { decorators } from '@state/container';
import type { IStateUIConnector } from '@state/state-ui-connector/interfaces/state-ui-connector';
import { TYPES } from '@state/types';
import { Feature } from '@shared/types';
import {
  type IGlobalState,
  IAvailableCategoryItemsState,
  IAvailableCategoryItemsSerializedState,
} from '../../interfaces';

const { lazyInject } = decorators;

@injectable()
export abstract class BaseAvailableCategoryItemsState<Key = string> implements IAvailableCategoryItemsState<Key> {
  @lazyInject(TYPES.StateUIConnector)
  protected _stateUiConnector!: IStateUIConnector;

  @lazyInject(TYPES.GlobalState)
  protected _globalState!: IGlobalState;

  protected _loanedTier: number;
  protected _neutralItems: Set<Key>;
  protected _loanedItems: Set<Key>;
  protected _itemsList: Key[];

  constructor() {
    this._loanedTier = 0;
    this._neutralItems = new Set();
    this._loanedItems = new Set();
    this._itemsList = [];

    this._stateUiConnector.registerEventEmitter(this, ['_loanedTier', '_itemsList']);
  }

  get loanedTier() {
    return this._loanedTier;
  }

  listAvailableItems(): Key[] {
    return this._itemsList;
  }

  isItemAvailable(itemName: Key, tier: number): boolean {
    if (!(this._neutralItems.has(itemName) || this._loanedItems.has(itemName))) {
      return false;
    }

    const highestAvailableTier = this.getItemHighestAvailableTier(itemName);
    if (tier > highestAvailableTier) {
      return false;
    }

    return true;
  }

  getItemHighestAvailableTier(itemName: Key): number {
    let result: number | undefined = undefined;

    if (this._neutralItems.has(itemName) || this._loanedItems.has(itemName)) {
      result = this._loanedTier;
    }

    if (result === undefined) {
      throw new Error(`Item ${itemName} is not available`);
    }

    return result;
  }

  recalculate() {
    this.recalculateNeutralItemsList();
    this.recalculateCompleteList();
  }

  async startNewState(): Promise<void> {
    this._loanedTier = 6;
    this._loanedItems.clear();
  }

  async deserialize(serializedState: IAvailableCategoryItemsSerializedState<Key>): Promise<void> {
    this._loanedTier = serializedState.loanedTier;
    this._loanedItems.clear();

    serializedState.loanedItems.forEach((itemName) => {
      this._loanedItems.add(itemName);
    });
  }

  serialize(): IAvailableCategoryItemsSerializedState<Key> {
    return {
      loanedTier: this._loanedTier,
      loanedItems: Array.from(this._loanedItems.values()),
    };
  }

  protected abstract recalculateNeutralItemsList(): void;

  protected abstract getItemRequiredFeatures(itemName: Key): Feature[];

  private recalculateCompleteList() {
    const completeList = Array.from(this._neutralItems.values());

    this._loanedItems.forEach((itemName) => {
      if (!this._neutralItems.has(itemName)) {
        completeList.push(itemName);
      }
    });

    const filteredList = completeList.filter((itemName) => {
      const requiredFeatures = this.getItemRequiredFeatures(itemName);
      const allFeaturesUnlocked = requiredFeatures.every((feature) =>
        this._globalState.unlockedFeatures.isFeatureUnlocked(feature),
      );

      return allFeaturesUnlocked;
    });

    this._itemsList.length = 0;
    this._itemsList.push(...filteredList);
  }
}
