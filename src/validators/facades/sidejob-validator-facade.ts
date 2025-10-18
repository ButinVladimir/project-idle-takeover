import { inject, injectable } from 'inversify';
import { styleText } from 'node:util';
import sidejobs from '@configs/sidejobs.json';
import { SCHEMA_PROPERTY } from '@shared/index';
import { type ISidejobValidator, IValidatorFacade } from '../interfaces';
import { VALIDATOR_TYPES } from '../types';

@injectable()
export class SidejobValidatorFacade implements IValidatorFacade {
  @inject(VALIDATOR_TYPES.SidejobValidator)
  private _sidejobValidator!: ISidejobValidator;

  private _parameters!: { fn: (sidejobName: string) => boolean; name: string }[];

  async validate(): Promise<void> {
    console.log('Sidejobs validation has started');

    this._parameters = [
      { fn: this._sidejobValidator.validateSidejobTitle, name: 'title' },
      { fn: this._sidejobValidator.validateSidejobOverview, name: 'overview' },
    ];

    Object.keys(sidejobs).forEach((sidejobName) => {
      if (sidejobName === SCHEMA_PROPERTY) {
        return;
      }

      this.validateSidejob(sidejobName);
    });

    console.log('Sidejobs validation has finished');
  }

  private validateSidejob(sidejob: string) {
    this._parameters.forEach((parameter) => {
      const result = parameter.fn.call(this._sidejobValidator, sidejob);

      if (!result) {
        this.printError(sidejob, parameter.name);
      }
    });
  }

  private printError(sidejobName: string, error: string) {
    const text = `Sidejob ${styleText('cyanBright', sidejobName)} is missing ${styleText('redBright', error)}`;

    console.log(text);
  }
}
