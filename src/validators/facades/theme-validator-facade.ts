import { inject, injectable } from 'inversify';
import Ajv from 'ajv';
import { styleText } from 'node:util';
import themes from '@configs/themes.json';
import themesSchema from '@configs/schemas/themes.json';
import { THEMES } from '@shared/index';
import { type IThemeValidator, IValidatorFacade } from '../interfaces';
import { VALIDATOR_TYPES } from '../types';

@injectable()
export class ThemeValidatorFacade implements IValidatorFacade {
  @inject(VALIDATOR_TYPES.ThemeValidator)
  private _themeValidator!: IThemeValidator;

  async validate(ajv: Ajv): Promise<void> {
    console.log('Theme validation has started');

    await this.validateSchema(ajv);
    this.validateThemes();

    console.log('Theme validation has finished');
  }

  private async validateSchema(ajv: Ajv): Promise<void> {
    console.log(`\tValidating ${styleText('cyanBright', 'themes schema')}`);

    const validate = await ajv.compile(themesSchema);

    if (!validate(themes)) {
      console.log(`\t\t${styleText('cyanBright', 'Themes schema')} is ${styleText('redBright', 'incorrect')}`);
      console.error(validate.errors);
    }
  }

  private validateThemes() {
    THEMES.forEach((theme) => {
      this._themeValidator.validate(theme);
    });
  }
}
