import { injectable, inject } from "inversify";
import { type IValidatorFacade } from "./interfaces";
import { VALIDATOR_TYPES } from "./types";

@injectable()
export class ValidatorFacade implements IValidatorFacade {
  @inject(VALIDATOR_TYPES.ProgramValidatorFacade)
  private _programValidatorFacade!: IValidatorFacade;

  @inject(VALIDATOR_TYPES.NameValidatorFacade)
  private _nameValidatorFacade!: IValidatorFacade;

    @inject(VALIDATOR_TYPES.ThemeValidatorFacade)
  private _themeValidatorFacade!: IValidatorFacade;


  validate(): void {
    console.log('Validation has started');

    this._programValidatorFacade.validate();
    this._nameValidatorFacade.validate();
    this._themeValidatorFacade.validate();

    console.log('Validation has finished');
  }
}