import { inject, injectable } from 'inversify';
import { styleText } from 'node:util';
import names from '@configs/names.json';
import { type INameValidator, IValidatorFacade } from '../interfaces';
import { VALIDATOR_TYPES } from '../types';

@injectable()
export class NameValidatorFacade implements IValidatorFacade {
  @inject(VALIDATOR_TYPES.NameValidator)
  private _nameValidator!: INameValidator;

  async validate(): Promise<void> {
    console.log('Name validation has started');

    names.clones.forEach((name) => {
      this.validateCloneName(name);
    });
    names.districts.forEach((name) => {
      this.validateDistrictName(name);
    });

    console.log('Name validation has finished');
  }

  private validateCloneName(name: string) {
    if (!this._nameValidator.validateCloneName(name)) {
      this.printError(name, 'Clone name');
    }
  }

  private validateDistrictName(name: string) {
    if (!this._nameValidator.validateDistrictName(name)) {
      this.printError(name, 'District name');
    }
  }

  private printError(name: string, nameType: string) {
    const text = `${styleText('redBright', nameType)} ${styleText('cyanBright', name)} is missing`;

    console.log(text);
  }
}
