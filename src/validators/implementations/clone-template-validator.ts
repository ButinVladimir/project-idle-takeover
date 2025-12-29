import { injectable } from 'inversify';
import { styleText } from 'node:util';
import { CLONE_TEMPLATE_TEXTS } from '@texts/index';
import { ICloneTemplateValidator } from '../interfaces';

@injectable()
export class CloneTemplateValidator implements ICloneTemplateValidator {
  validate(name: string): void {
    console.log(`\tValidating clone template ${styleText('cyanBright', name)}`);

    this.validateTitle(name);
    this.validateOverview(name);
  }

  private validateTitle(name: string) {
    if (!CLONE_TEMPLATE_TEXTS[name]?.title) {
      this.printMissingProperty(name, 'title');
    }
  }

  private validateOverview(name: string) {
    if (!CLONE_TEMPLATE_TEXTS[name]?.overview) {
      this.printMissingProperty(name, 'overview');
    }
  }

  private printMissingProperty(name: string, property: string) {
    console.log(
      `\t\tClone template ${styleText('cyanBright', name)} is ${styleText('redBright', 'missing')} ${property}`,
    );
  }
}
