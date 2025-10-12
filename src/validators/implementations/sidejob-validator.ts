import { injectable } from 'inversify';
import { SIDEJOB_TEXTS } from '@texts/index';
import { ISidejobValidator } from "../interfaces";

@injectable()
export class SidejobValidator implements ISidejobValidator {
  validateSidejobTitle(name: string): boolean {
    return !!SIDEJOB_TEXTS[name]?.title;
  }

  validateSidejobOverview(name: string): boolean {
    return !!SIDEJOB_TEXTS[name]?.overview;
  }
}