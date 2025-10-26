import { Theme } from '@shared/index';

export interface IThemeValidator {
  validate(themeName: Theme): void;
}
