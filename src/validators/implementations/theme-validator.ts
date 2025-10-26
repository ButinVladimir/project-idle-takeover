import { injectable } from 'inversify';
import { styleText } from 'node:util';
import themes from '@configs/themes.json';
import { THEME_NAMES } from '@components/settings-page/components/settings-form/constants';
import { Theme } from '@shared/index';
import { IThemeValidator } from '../interfaces';

@injectable()
export class ThemeValidator implements IThemeValidator {
  validate(theme: Theme) {
    console.log(`\tValidating theme ${styleText('cyanBright', theme)}`);

    this.validateConfig(theme);
    this.validateTitle(theme);
  }

  private validateConfig(theme: Theme) {
    if (!themes[theme]) {
      console.log(`\t\tTheme ${styleText('cyanBright', theme)} is ${styleText('redBright', 'missing in config')}`);
    }
  }

  private validateTitle(theme: Theme) {
    if (!THEME_NAMES[theme]) {
      console.log(`\t\tTheme ${styleText('cyanBright', theme)} is ${styleText('redBright', 'missing title')}`);
    }
  }
}
