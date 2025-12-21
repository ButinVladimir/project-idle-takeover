import Ajv from 'ajv';
import { inject, injectable } from 'inversify';
import { styleText } from 'node:util';
import factionsSchema from '@configs/schemas/factions.json';
import { typedFactions } from '@state/faction-state';
import { type IFactionValidator, IValidatorFacade } from '../interfaces';
import { VALIDATOR_TYPES } from '../types';

@injectable()
export class FactionValidatorFacade implements IValidatorFacade {
  @inject(VALIDATOR_TYPES.FactionValidator)
  private _factionValidator!: IFactionValidator;

  async validate(ajv: Ajv): Promise<void> {
    console.log('Faction validation has started');

    await this.validateSchema(ajv);
    this.validateFactions();

    console.log('Faction validation has finished');
  }

  private async validateSchema(ajv: Ajv): Promise<void> {
    console.log(`\tValidating ${styleText('cyanBright', 'factions schema')}`);

    const validate = await ajv.compile(factionsSchema);

    if (!validate(typedFactions)) {
      console.log(`\t\t${styleText('cyanBright', 'Factions schema')} is ${styleText('redBright', 'incorrect')}`);
      console.error(validate.errors);
    }
  }

  private validateFactions() {
    Object.keys(typedFactions).forEach((faction) => {
      this._factionValidator.validate(faction);
    });
  }
}
