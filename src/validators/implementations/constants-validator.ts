import constants from '@configs/constants.json';
import scenarios from '@configs/scenarios.json';
import { IScenarioValues } from '@state/scenario-state';
import { IConstantsValidator } from '../interfaces';

export class ConstantsValidator implements IConstantsValidator {
  validateStartingScenario(): boolean {
    const startingScenario = constants.startingScenario;

    return !!(scenarios as any as Record<string, IScenarioValues>)[startingScenario];
  }
}
