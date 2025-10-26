import { injectable } from 'inversify';
import { styleText } from 'node:util';
import { CLONE_NAMES, DISTRICT_NAMES } from '@texts/index';
import { INameValidator } from '../interfaces';

@injectable()
export class NameValidator implements INameValidator {
  validateCloneName(name: string) {
    console.log(`\tValidating clone name ${styleText('cyanBright', name)}`);

    if (!CLONE_NAMES[name]) {
      this.printMissingName(name, 'Clone name');
    }
  }

  validateDistrictName(name: string) {
    console.log(`\tValidating district name ${styleText('cyanBright', name)}`);

    if (!DISTRICT_NAMES[name]) {
      this.printMissingName(name, 'District name');
    }
  }

  private printMissingName(name: string, nameType: string) {
    console.log(`\t\t${nameType} ${styleText('cyanBright', name)} is ${styleText('redBright', 'missing')}`);
  }
}
