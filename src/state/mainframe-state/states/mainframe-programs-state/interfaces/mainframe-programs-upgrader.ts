import { ProgramName } from '../../progam-factory';

export interface IMainframeProgramsUpgrader {
  upgradeMaxAllPrograms(): void;
  upgradeMaxProgram(programName: ProgramName): void;
  autoupgrade(actionCount: number): void;
}
