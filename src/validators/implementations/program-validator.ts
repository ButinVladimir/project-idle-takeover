import { injectable } from 'inversify';
import programs from '@configs/programs.json';
import { styleText } from 'node:util';
import { ProgramName } from '@state/mainframe-state';
import { PROGRAM_TEXTS } from '@texts/index';
import { IProgramValidator } from '../interfaces';

@injectable()
export class ProgramValidator implements IProgramValidator {
  validate(programName: ProgramName) {
    console.log(`\tValidating program ${styleText('cyanBright', programName)}`);

    this.validateConfig(programName);
    this.validateTitle(programName);
    this.validateOverview(programName);
  }

  private validateConfig(programName: ProgramName) {
    if (!programs[programName]) {
      this.printMissingProperty(programName, 'config');
    }
  }

  private validateTitle(programName: ProgramName) {
    if (!PROGRAM_TEXTS[programName]?.title) {
      this.printMissingProperty(programName, 'title');
    }
  }

  private validateOverview(programName: ProgramName) {
    if (!PROGRAM_TEXTS[programName]?.overview) {
      this.printMissingProperty(programName, 'overview');
    }
  }

  private printMissingProperty(programName: ProgramName, property: string) {
    console.log(
      `\t\tProgram ${styleText('cyanBright', programName)} is ${styleText('redBright', 'missing')} ${property}`,
    );
  }
}
