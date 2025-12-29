export interface IRewardsGrowthState {
  growthByProgram: number;
  resetValues(): void;
  clearValues(): void;
  getGrowthByDistrict(districtIndex: number): number;
}
