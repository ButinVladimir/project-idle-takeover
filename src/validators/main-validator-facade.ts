import { injectable, inject } from 'inversify';
import Ajv from 'ajv';
import programNamesSchema from '@configs/schemas/common/program-name.json';
import linearProgressionSchema from '@configs/schemas/common/linear-progression.json';
import tieredLinearProgressionSchema from '@configs/schemas/common/tiered-linear-progression.json';
import geometricProgressionSchema from '@configs/schemas/common/geometric-progression.json';
import tieredGeometricProgressionSchema from '@configs/schemas/common/tiered-geometric-progression.json';
import featuresSchema from '@configs/schemas/common/feature.json';
import { type IValidatorFacade, type IMainValidatorFacade } from './interfaces';
import { VALIDATOR_TYPES } from './types';

@injectable()
export class MainValidatorFacade implements IMainValidatorFacade {
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

  @inject(VALIDATOR_TYPES.ContractValidatorFacade)
  private _contractValidatorFacade!: IValidatorFacade;

  @inject(VALIDATOR_TYPES.DistrictTypeValidatorFacade)
  private _districtTypeValidatorFacade!: IValidatorFacade;

  @inject(VALIDATOR_TYPES.FactionValidatorFacade)
  private _factionValidatorFacade!: IValidatorFacade;

  @inject(VALIDATOR_TYPES.ConstantsValidatorFacade)
  private _constantsValidatorFacade!: IValidatorFacade;

  @inject(VALIDATOR_TYPES.StoryEventsValidatorFacade)
  private _storyEventsValidatorFacade!: IValidatorFacade;

  @inject(VALIDATOR_TYPES.ScenariosValidatorFacade)
  private _scenariosValidatorFacade!: IValidatorFacade;

  async validate(): Promise<void> {
    console.log('Validation has started');

    const ajv = this.prepareAjv();

    await this._programValidatorFacade.validate(ajv);
    await this._nameValidatorFacade.validate(ajv);
    await this._themeValidatorFacade.validate(ajv);
    await this._cloneTemplateValidatorFacade.validate(ajv);
    await this._sidejobValidatorFacade.validate(ajv);
    await this._contractValidatorFacade.validate(ajv);
    await this._districtTypeValidatorFacade.validate(ajv);
    await this._factionValidatorFacade.validate(ajv);
    await this._constantsValidatorFacade.validate(ajv);
    await this._storyEventsValidatorFacade.validate(ajv);
    await this._scenariosValidatorFacade.validate(ajv);

    console.log('Validation has finished');
  }

  private prepareAjv(): Ajv {
    return new Ajv({
      schemas: [
        programNamesSchema,
        linearProgressionSchema,
        tieredLinearProgressionSchema,
        geometricProgressionSchema,
        tieredGeometricProgressionSchema,
        featuresSchema,
      ],
      allErrors: true,
    });
  }
}
