import { injectable } from 'inversify';
import programs from '@configs/programs.json';
import { ProgramName } from "@state/mainframe-state";
import { PROGRAM_TEXTS } from '@texts/index';
import { IProgramValidator } from "../interfaces";

@injectable()
export class ProgramValidator implements IProgramValidator {
  validateConfig(programName: ProgramName): boolean {
    return !!programs[programName];
  }

  validateTitle(programName: ProgramName): boolean {
    return !!PROGRAM_TEXTS[programName]?.title;
  }

  validateOverview(programName: ProgramName): boolean {
    return !!PROGRAM_TEXTS[programName]?.overview;
  }
}