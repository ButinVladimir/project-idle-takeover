import { IDistrictInfluenceSerializedParameter } from '../serialized-states/district-influence-serialized-parameter';

export interface IDistrictInfluenceParameter {
  tier: number;
  points: number;
  increasePoints(delta: number): void;
  getTierRequirements(tier: number): number;
  recalculate(): void;
  setTier(tier: number): void;
  serialize(): IDistrictInfluenceSerializedParameter;
  deserialize(serializedParameter: IDistrictInfluenceSerializedParameter): void;
  removeAllEventListeners(): void;
}
