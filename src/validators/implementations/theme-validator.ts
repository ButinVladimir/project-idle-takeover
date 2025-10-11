import { injectable } from 'inversify';
import themes from '@configs/themes.json';
import { Theme } from '@shared/index';
import { IThemeValidator } from "../interfaces";

@injectable()
export class ThemeValidator implements IThemeValidator {
  validateConfig(themeName: Theme): boolean {
    return !!themes[themeName];
  }
}