import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { Feature, NotificationType } from '@shared/types';
import type { IStateUIConnector } from '@state/state-ui-connector/interfaces/state-ui-connector';
import type { INotificationsState } from '@state/notifications-state/interfaces/notifications-state';
import { TYPES } from '@state/types';
import { UNLOCKED_FEATURE_TEXTS } from '@texts/unlocked-features';
import { type IUnlockState, IUnlockedFeaturesSerializedState, IUnlockedFeaturesState } from './interfaces';

const { lazyInject } = decorators;

@injectable()
export class UnlockedFeaturesState implements IUnlockedFeaturesState {
  @lazyInject(TYPES.UnlockState)
  private _unlockState!: IUnlockState;

  @lazyInject(TYPES.NotificationsState)
  private _notificationsState!: INotificationsState;

  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  private _unlockedFeatures: Set<Feature>;

  constructor() {
    this._unlockedFeatures = new Set<Feature>();

    this._stateUiConnector.registerEventEmitter(this, ['_unlockedFeatures']);
  }

  isFeatureUnlocked(feature: Feature): boolean {
    return this._unlockedFeatures.has(feature);
  }

  unlockFeature(feature: Feature) {
    if (!this._unlockedFeatures.has(feature)) {
      this._unlockedFeatures.add(feature);

      this._unlockState.requestRecalculation();

      this._notificationsState.pushNotification(
        NotificationType.featureUnlocked,
        UNLOCKED_FEATURE_TEXTS[feature].message(),
      );
    }
  }

  listUnlockedFeatures(): Feature[] {
    return Array.from(this._unlockedFeatures.values());
  }

  async startNewState(): Promise<void> {
    this._unlockedFeatures.clear();
  }

  async deserialize(serializedState: IUnlockedFeaturesSerializedState): Promise<void> {
    this._unlockedFeatures.clear();

    serializedState.unlockedFeatures.forEach((feature: Feature) => this._unlockedFeatures.add(feature));
  }

  serialize(): IUnlockedFeaturesSerializedState {
    return {
      unlockedFeatures: Array.from(this._unlockedFeatures.values()),
    };
  }
}
