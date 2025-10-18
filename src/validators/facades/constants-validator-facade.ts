import { inject, injectable } from 'inversify';
import { styleText } from 'node:util';
import { type IConstantsValidator, IValidatorFacade } from '../interfaces';
import { VALIDATOR_TYPES } from '../types';

@injectable()
export class ConstantsValidatorFacade implements IValidatorFacade {
  @inject(VALIDATOR_TYPES.ConstantsValidator)
  private _constantsValidator!: IConstantsValidator;

  async validate(): Promise<void> {
    console.log('Constants validation has started');

    this.validateStartingScenario();

    console.log('District types validation has finished');
  }

  private validateStartingScenario() {
    if (!this._constantsValidator.validateStartingScenario()) {
      const text = `Constants have incorrect ${styleText('redBright', 'starting scenario')}`;

      console.log(text);
    }
  }
}
