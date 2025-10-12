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

  @inject(VALIDATOR_TYPES.CloneTemplateValidatorFacade)
  private _cloneTemplateValidatorFacade!: IValidatorFacade;

  @inject(VALIDATOR_TYPES.SidejobValidatorFacade)
  private _sidejobValidatorFacade!: IValidatorFacade;

  @inject(VALIDATOR_TYPES.DistrictTypeValidatorFacade)
  private _districtTypeValidatorFacade!: IValidatorFacade;

  async validate(): Promise<void> {
    console.log('Validation has started');

    await this._programValidatorFacade.validate();
    await this._nameValidatorFacade.validate();
    await this._themeValidatorFacade.validate();
    await this._cloneTemplateValidatorFacade.validate();
    await this._sidejobValidatorFacade.validate();
    await this._districtTypeValidatorFacade.validate();

    console.log('Validation has finished');
  }
}