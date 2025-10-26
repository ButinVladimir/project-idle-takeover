import { styleText } from 'node:util';
import constants from '@configs/constants.json';
import scenarios from '@configs/scenarios.json';
import { IScenarioValues } from '@state/scenario-state';
import { IConstantsValidator } from '../interfaces';

export class ConstantsValidator implements IConstantsValidator {
  validate() {
    console.log(`\tValidating ${styleText('cyanBright', 'constants')}`);

    this.validateStartingScenario();
  }

  private validateStartingScenario() {
    const startingScenario = constants.startingScenario;

    if (!(scenarios as any as Record<string, IScenarioValues>)[startingScenario]) {
      console.log(
        `\t\tStarting scenario ${styleText('cyanBright', startingScenario)} is ${styleText('redBright', 'incorrect')}`,
      );
    }
  }
}
