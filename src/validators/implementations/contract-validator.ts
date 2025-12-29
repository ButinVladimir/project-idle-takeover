import { injectable } from 'inversify';
import { styleText } from 'node:util';
import { CONTRACT_TEXTS } from '@texts/index';
import { IContractValidator } from '../interfaces';

@injectable()
export class ContractValidator implements IContractValidator {
  validate(name: string): void {
    console.log(`\tValidating contract ${styleText('cyanBright', name)}`);

    this.validateTitle(name);
    this.validateOverview(name);
  }

  private validateTitle(name: string) {
    if (!CONTRACT_TEXTS[name]?.title) {
      this.printMissingProperty(name, 'title');
    }
  }

  private validateOverview(name: string) {
    if (!CONTRACT_TEXTS[name]?.overview) {
      this.printMissingProperty(name, 'overview');
    }
  }

  private printMissingProperty(name: string, property: string) {
    console.log(`\t\tContract ${styleText('cyanBright', name)} is ${styleText('redBright', 'missing')} ${property}`);
  }
}
