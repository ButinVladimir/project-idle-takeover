import { ProgramName } from '../../progam-factory';

export interface IMainframeProgramsUpgrader {
  upgradeMaxPrograms(programNames: ProgramName[]): void;
  upgradeMaxProgram(programName: ProgramName): void;
  autoupgrade(actionCount: number): void;
  calculateLevelFromMoney(name: ProgramName, tier: number, money: number): number;
}
