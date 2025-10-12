export interface ICloneTemplateValidator {
  validateCloneTemplateTitle(name: string): boolean;
  validateCloneTemplateOverview(name: string): boolean;
}