import { ISerializeable, Feature } from '@shared/index';
import { IUnlockedFeaturesSerializedState } from './serialized-states';

export interface IUnlockedFeaturesState extends ISerializeable<IUnlockedFeaturesSerializedState> {
  isFeatureUnlocked(feature: Feature): boolean;
  unlockFeature(feature: Feature): void;
  listUnlockedFeatures(): Feature[];
}
