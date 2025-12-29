import { injectable } from 'inversify';
import { styleText } from 'node:util';
import { SIDEJOB_TEXTS } from '@texts/index';
import { ISidejobValidator } from '../interfaces';

@injectable()
export class SidejobValidator implements ISidejobValidator {
  validate(name: string): void {
    console.log(`\tValidating sidejob ${styleText('cyanBright', name)}`);

    this.validateTitle(name);
    this.validateOverview(name);
  }

  private validateTitle(name: string) {
    if (!SIDEJOB_TEXTS[name]?.title) {
      this.printMissingProperty(name, 'title');
    }
  }

  private validateOverview(name: string) {
    if (!SIDEJOB_TEXTS[name]?.overview) {
      this.printMissingProperty(name, 'overview');
    }
  }

  private printMissingProperty(name: string, property: string) {
    console.log(`\t\tSidejob ${styleText('cyanBright', name)} is ${styleText('redBright', 'missing')} ${property}`);
  }
}
