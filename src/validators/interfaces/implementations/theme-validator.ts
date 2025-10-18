import { Theme } from '@shared/index';

export interface IThemeValidator {
  validateConfig(themeName: Theme): boolean;
}
