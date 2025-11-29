import { injectable } from 'inversify';
import { styleText } from 'node:util';
import { typedDistrictTypes } from '@state/city-state';
import { DISTRICT_TYPE_TEXTS } from '@texts/index';
import { IDistrictTypeValidator } from '../interfaces';

@injectable()
export class DistrictTypeValidator implements IDistrictTypeValidator {
  validate(name: string): void {
    console.log(`\tValidating district type ${styleText('cyanBright', name)}`);

    this.validateTitle(name);
    this.validateOverview(name);
    this.validatePrimaryActivityCompletionTime(name);
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

  private validatePrimaryActivityCompletionTime(name: string) {
    const districtType = typedDistrictTypes[name];

    if (
      districtType.primaryActivityTimeMultipliers.completionTime >=
      districtType.primaryActivityTimeMultipliers.generationTime
    ) {
      console.log(
        `\t\tDistrict type ${styleText('cyanBright', name)} primary activity completion time ${styleText('redBright', 'is bigger than generation time')}`,
      );
    }
  }

  private printMissingProperty(name: string, property: string) {
    console.log(
      `\t\tDistrict type ${styleText('cyanBright', name)} is ${styleText('redBright', 'missing')} ${property}`,
    );
  }
}
