export interface ICompanyClonesLevelUpgrader {
  upgradeMaxAllClones(): void;
  upgradeMaxClone(id: string): void;
  autoupgrade(actionCount: number): void;
}
