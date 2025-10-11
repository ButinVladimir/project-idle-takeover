import { inject, injectable } from 'inversify';
import { styleText } from 'node:util';
import { AutobuyerProgramName, MultiplierProgramName, OtherProgramName, ProgramName } from '@state/mainframe-state';
import { type IProgramValidator, IValidatorFacade } from '../interfaces';
import { VALIDATOR_TYPES } from '../types';

@injectable()
export class ProgramValidatorFacade implements IValidatorFacade {
  @inject(VALIDATOR_TYPES.ProgramValidator)
  private _programValidator!: IProgramValidator;

  validate(): void {
    console.log('Program validation has started');

    Object.values(MultiplierProgramName).forEach((programName) => {
      this.validateProgram(programName);
    });
    Object.values(AutobuyerProgramName).forEach((programName) => {
      this.validateProgram(programName);
    });
    Object.values(OtherProgramName).forEach((programName) => {
      this.validateProgram(programName);
    });

    console.log('Program validation has finished');
  }

  private validateProgram(programName: ProgramName) {
    const parameters = [
      { fn: this._programValidator.validateConfig, name: 'configuration' },
      { fn: this._programValidator.validateTitle, name: 'title' },
      { fn: this._programValidator.validateOverview, name: 'overview' },
    ];

    parameters.forEach((parameter) => {
      const result = parameter.fn.call(this._programValidator, programName);

      if (!result) {
        this.printError(programName, parameter.name);
      }
    });
  }

  private printError(programName: ProgramName, error: string) {
    const text = `Program ${styleText('cyanBright', programName)} is missing ${styleText('redBright', error)}`;

    console.log(text);
  }
}
