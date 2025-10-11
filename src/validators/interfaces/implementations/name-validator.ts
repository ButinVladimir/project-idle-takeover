export interface INameValidator {
  validateCloneName(name: string): boolean;
  validateDistrictName(name: string): boolean;
}