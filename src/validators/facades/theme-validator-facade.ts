import { inject, injectable } from 'inversify';
import { styleText } from 'node:util';
import { Theme } from '@shared/index';
import { type IThemeValidator, IValidatorFacade } from '../interfaces';
import { VALIDATOR_TYPES } from '../types';

@injectable()
export class ThemeValidatorFacade implements IValidatorFacade {
  @inject(VALIDATOR_TYPES.ThemeValidator)
  private _themeValidator!: IThemeValidator;

  async validate(): Promise<void> {
    console.log('Theme validation has started');

    Object.values(Theme).forEach((theme) => {
      this.validateConfig(theme);
    });

    console.log('Theme validation has finished');
  }

  private validateConfig(theme: Theme) {
    if (!this._themeValidator.validateConfig(theme)) {
      this.printError(theme);
    }
  }

  private printError(theme: Theme) {
    const text = `Theme ${styleText('cyanBright', theme)} is missing ${styleText('redBright', 'in config')}`;

    console.log(text);
  }
}
