import { ProgramName } from '@state/mainframe-state';

export interface IProgramValidator {
  validate(programName: ProgramName): void;
}
