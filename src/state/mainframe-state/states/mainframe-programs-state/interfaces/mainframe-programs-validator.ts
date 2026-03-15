import { ProgramName } from '@state/mainframe-state/states/progam-factory';
import { ProgramValidationResult } from '../types';

export interface IMainframeProgramsValidator {
  calculateProgramCost(name: ProgramName, tier: number, level: number): number;
  validateProgram(name: ProgramName, tier: number, level: number): ProgramValidationResult;
}
