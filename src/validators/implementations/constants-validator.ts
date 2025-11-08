import { styleText } from 'node:util';
import { typedScenarios } from '@state/scenario-state';
import { typedConstants } from '@shared/index';
import { IConstantsValidator } from '../interfaces';

export class ConstantsValidator implements IConstantsValidator {
  validate() {
    console.log(`\tValidating ${styleText('cyanBright', 'constants')}`);

    this.validateStartingScenario();
  }

  private validateStartingScenario() {
    const startingScenario = typedConstants.startingScenario;

    if (!typedScenarios[startingScenario]) {
      console.log(
        `\t\tStarting scenario ${styleText('cyanBright', startingScenario)} is ${styleText('redBright', 'incorrect')}`,
      );
    }
  }
}
