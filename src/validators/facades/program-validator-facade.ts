import { inject, injectable } from 'inversify';
import { Ajv } from 'ajv';
import programsSchema from '@configs/schemas/programs.json';
import { styleText } from 'node:util';
import { AutomationProgram, MultiplierProgramName, OtherProgramName, typedPrograms } from '@state/mainframe-state';
import { type IProgramValidator, IValidatorFacade } from '../interfaces';
import { VALIDATOR_TYPES } from '../types';

@injectable()
export class ProgramValidatorFacade implements IValidatorFacade {
  @inject(VALIDATOR_TYPES.ProgramValidator)
  private _programValidatorValidator!: IProgramValidator;

  async validate(ajv: Ajv): Promise<void> {
    console.log('Program validation has started');

    await this.validateSchema(ajv);
    this.validatePrograms();

    console.log('Program validation has finished');
  }

  private async validateSchema(ajv: Ajv): Promise<void> {
    console.log(`\tValidating ${styleText('cyanBright', 'programs schema')}`);

    const validate = await ajv.compile(programsSchema);

    if (!validate(typedPrograms)) {
      console.log(`\t\t${styleText('cyanBright', 'Programs schema')} is ${styleText('redBright', 'incorrect')}`);
      console.error(validate.errors);
    }
  }

  private validatePrograms(): void {
    [
      ...Object.values(MultiplierProgramName),
      ...Object.values(AutomationProgram),
      ...Object.values(OtherProgramName),
    ].forEach((programName) => {
      this._programValidatorValidator.validate(programName);
    });
  }
}
