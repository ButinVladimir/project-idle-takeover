import { ProgramName } from '@state/mainframe-state/states/progam-factory';
import { ProgramsBatchValidationResult, ProgramValidationResult } from '../types';

export interface IMainframeProgramsValidator {
  calculateProgramCost(name: ProgramName, tier: number, level: number): number;
  validateProgram(name: ProgramName, tier: number, level: number): ProgramValidationResult;
  validateProgramsBatch(names: ProgramName[], tier: number, level: number): ProgramsBatchValidationResult;
}
