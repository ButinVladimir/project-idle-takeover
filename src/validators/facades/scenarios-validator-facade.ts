import Ajv from 'ajv';
import { inject, injectable } from 'inversify';
import { styleText } from 'node:util';
import scenariosSchema from '@configs/schemas/scenarios.json';
import { typedScenarios } from '@state/scenario-state';
import { type IScenariosValidator, IValidatorFacade } from '../interfaces';
import { VALIDATOR_TYPES } from '../types';

@injectable()
export class ScenariosValidatorFacade implements IValidatorFacade {
  @inject(VALIDATOR_TYPES.ScenariosValidator)
  private _scenariosValidator!: IScenariosValidator;

  async validate(ajv: Ajv): Promise<void> {
    console.log('Scenarios validation has started');

    await this.validateSchema(ajv);
    this.validateScenarios();

    console.log('Scenarios validation has finished');
  }

  private async validateSchema(ajv: Ajv): Promise<void> {
    console.log(`\tValidating ${styleText('cyanBright', 'scenarios schema')}`);

    const validate = await ajv.compile(scenariosSchema);

    if (!validate(typedScenarios)) {
      console.log(`\t\t${styleText('cyanBright', 'Scenarios schema')} is ${styleText('redBright', 'incorrect')}`);
      console.error(validate.errors);
    }
  }

  private validateScenarios() {
    Object.keys(typedScenarios).forEach((scenario) => {
      this._scenariosValidator.validate(scenario);
    });
  }
}
