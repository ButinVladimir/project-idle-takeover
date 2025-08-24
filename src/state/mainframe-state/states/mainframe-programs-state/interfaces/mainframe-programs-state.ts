import { ISerializeable } from '@shared/index';
import { IProgram, ProgramName } from '@state/mainframe-state/states/progam-factory';
import { IMainframeProgramsSerializedState } from './mainframe-programs-serialized-state';
import { IMainframeProgramsUpgrader } from './mainframe-programs-upgrader';

export interface IMainframeProgramsState extends ISerializeable<IMainframeProgramsSerializedState> {
  upgrader: IMainframeProgramsUpgrader;
  calculateProgramCost(name: ProgramName, tier: number, level: number): number;
  calculateLevelFromMoney(name: ProgramName, tier: number, money: number): number;
  purchaseProgram(name: ProgramName, tier: number, level: number): boolean;
  listOwnedPrograms(): IProgram[];
  getOwnedProgramByName(name: ProgramName): IProgram | undefined;
  toggleProgramsAutoUpgrade(active: boolean): void;
  moveProgram(programName: ProgramName, newPosition: number): void;
}
