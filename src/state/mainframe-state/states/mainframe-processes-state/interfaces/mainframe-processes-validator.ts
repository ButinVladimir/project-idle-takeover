import { ProgramName } from '../../progam-factory';
import { ProcessValidationResult } from '../types';

export interface IMainframeProcessesValidator {
  calculateAvailableRamForProgram(programName: ProgramName): number;
  validateProcess(programName: ProgramName, threads: number): ProcessValidationResult;
}
