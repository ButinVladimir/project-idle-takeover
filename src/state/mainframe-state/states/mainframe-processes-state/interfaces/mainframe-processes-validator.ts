import { ProgramName } from '../../progam-factory';
import { ProcessesBatchValidationResult, ProcessValidationResult } from '../types';

export interface IMainframeProcessesValidator {
  calculateRequiredRamForPrograms(programNames: ProgramName[], threads: number): number;
  calculateAvailableRamForPrograms(programNames: ProgramName[]): number;
  validateProcess(programName: ProgramName, threads: number): ProcessValidationResult;
  validateProcessesBatch(programNames: ProgramName[], threads: number): ProcessesBatchValidationResult;
}
