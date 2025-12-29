export interface IDistrictConnectionGraphGeneratorResult {
  connections: Map<number, Set<number>>;
  districtSizes: Map<number, number>;
}
