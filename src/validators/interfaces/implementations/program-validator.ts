import { ProgramName } from "@state/mainframe-state";

export interface IProgramValidator {
  validateConfig(programName: ProgramName): boolean;
  validateTitle(programName: ProgramName): boolean;
  validateOverview(programName: ProgramName): boolean;
}