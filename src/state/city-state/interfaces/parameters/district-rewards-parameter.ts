import { IDistrictRewardsSerializedParameter } from '../serialized-states';

export interface IDistrictRewardsParameter {
  points: number;
  totalMultiplier: number;
  increasePoints(delta: number): void;
  recalculate(): void;
  serialize(): IDistrictRewardsSerializedParameter;
  deserialize(serializedParameter: IDistrictRewardsSerializedParameter): void;
}
