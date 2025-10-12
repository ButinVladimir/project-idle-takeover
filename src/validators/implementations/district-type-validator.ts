import { injectable } from 'inversify';
import { DISTRICT_TYPE_TEXTS } from '@texts/index';
import { IDistrictTypeValidator } from "../interfaces";

@injectable()
export class DistrictTypeValidator implements IDistrictTypeValidator {
  validateDistrictTypeTitle(name: string): boolean {
    return !!DISTRICT_TYPE_TEXTS[name]?.title;
  }

  validateDistrictTypeOverview(name: string): boolean {
    return !!DISTRICT_TYPE_TEXTS[name]?.overview;
  }
}