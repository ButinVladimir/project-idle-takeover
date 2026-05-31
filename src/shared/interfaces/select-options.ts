export interface ISelectOption<V = string> {
  name: string;
  value: V;
}

export interface ISelectTieredOption<V = string> {
  name: string;
  tier: number;
  value: V;
}
