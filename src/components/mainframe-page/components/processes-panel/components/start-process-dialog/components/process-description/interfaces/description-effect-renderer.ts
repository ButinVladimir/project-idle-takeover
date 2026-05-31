export interface IDescriptionEffectRenderer {
  values: Record<string, any>;
  diffs: Record<string, { value: any; className: string }>;
  renderEffect(): unknown;
  recalculateValues(): void;
}
