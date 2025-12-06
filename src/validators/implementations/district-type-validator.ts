import { injectable } from 'inversify';
import { styleText } from 'node:util';
import { DISTRICT_TYPE_TEXTS } from '@texts/index';
import { IDistrictTypeValidator } from '../interfaces';

@injectable()
export class DistrictTypeValidator implements IDistrictTypeValidator {
  validate(name: string): void {
    console.log(`\tValidating district type ${styleText('cyanBright', name)}`);

    this.validateTitle(name);
    this.validateOverview(name);
  }

  private validateTitle(name: string) {
    if (!DISTRICT_TYPE_TEXTS[name]?.title) {
      this.printMissingProperty(name, 'title');
    }
  }

  private validateOverview(name: string) {
    if (!DISTRICT_TYPE_TEXTS[name]?.overview) {
      this.printMissingProperty(name, 'overview');
    }
  }

  private printMissingProperty(name: string, property: string) {
    console.log(
      `\t\tDistrict type ${styleText('cyanBright', name)} is ${styleText('redBright', 'missing')} ${property}`,
    );
  }
}
