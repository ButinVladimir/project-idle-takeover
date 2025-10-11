import { injectable } from 'inversify';
import { CLONE_NAMES, DISTRICT_NAMES } from '@texts/index';
import { INameValidator } from "../interfaces";

@injectable()
export class NameValidator implements INameValidator {
  validateCloneName(name: string): boolean {
    return !!CLONE_NAMES[name];
  }

  validateDistrictName(name: string): boolean {
    return !!DISTRICT_NAMES[name];
  }
}