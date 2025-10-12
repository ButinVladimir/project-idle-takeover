import { injectable } from 'inversify';
import { CLONE_TEMPLATE_TEXTS } from '@texts/index';
import { ICloneTemplateValidator } from "../interfaces";

@injectable()
export class CloneTemplateValidator implements ICloneTemplateValidator {
  validateCloneTemplateTitle(name: string): boolean {
    return !!CLONE_TEMPLATE_TEXTS[name]?.title;
  }

  validateCloneTemplateOverview(name: string): boolean {
    return !!CLONE_TEMPLATE_TEXTS[name]?.overview;
  }
}