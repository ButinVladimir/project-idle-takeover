import { inject, injectable } from 'inversify';
import { styleText } from 'node:util';
import factions from '@configs/factions.json';
import { Faction, SCHEMA_PROPERTY } from '@shared/index';
import { type IFactionValidator, IValidatorFacade } from '../interfaces';
import { VALIDATOR_TYPES } from '../types';

@injectable()
export class FactionValidatorFacade implements IValidatorFacade {
  @inject(VALIDATOR_TYPES.FactionValidator)
  private _factionValidator!: IFactionValidator;

  private _parameters!: { fn: (faction: Faction) => boolean; name: string }[];
  private _itemParameters!: { fn: (faction: Faction, special: boolean) => string[]; name: string }[];

  async validate(): Promise<void> {
    console.log('Faction validation has started');

    this._parameters = [
      { fn: this._factionValidator.validateTitle, name: 'title' },
      { fn: this._factionValidator.validateOverview, name: 'overview' },
    ];

    this._itemParameters = [
      { fn: this._factionValidator.validatePrograms, name: 'program' },
      { fn: this._factionValidator.validateCloneTemplates, name: 'clone template' },
    ];

    Object.keys(factions).forEach((faction) => {
      if (faction === SCHEMA_PROPERTY) {
        return;
      }

      this.validateFaction(faction);
    });

    console.log('Faction validation has finished');
  }

  private validateFaction(faction: Faction) {
    this._parameters.forEach((parameter) => {
      const result = parameter.fn.call(this._factionValidator, faction);

      if (!result) {
        this.printError(faction, parameter.name);
      }
    });

    this.validateItems(faction, false);
    this.validateItems(faction, true);
  }

  private validateItems(faction: Faction, special: boolean) {
    this._itemParameters.forEach((parameter) => {
      parameter.fn.call(this._factionValidator, faction, special).forEach((item) => {
        this.printMissingItem(faction, special, parameter.name, item);
      });
    });
  }

  private printError(faction: Faction, error: string) {
    const text = `Faction ${styleText('cyanBright', faction)} is missing ${styleText('redBright', error)}`;

    console.log(text);
  }

  private printMissingItem(faction: Faction, special: boolean, itemType: string, item: string) {
    const specialText = special ? 'special' : 'loaned';
    const text = `Faction ${styleText('cyanBright', faction)} has incorrect ${specialText} ${itemType} item ${styleText('redBright', item)}`;

    console.log(text);
  }
}
