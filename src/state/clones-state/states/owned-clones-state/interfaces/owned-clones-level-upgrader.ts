export interface IOwnedClonesLevelUpgrader {
  upgradeMaxAllClones(): void;
  upgradeMaxClone(id: string): void;
  autoupgrade(actionCount: number): void;
  calculateCloneLevelFromMoney(template: string, tier: number, money: number): number;
}
