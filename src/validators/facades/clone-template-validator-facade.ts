import { inject, injectable } from 'inversify';
import { styleText } from 'node:util';
import cloneTemplates from '@configs/clone-templates.json';
import { SCHEMA_PROPERTY } from '@shared/index';
import { type ICloneTemplateValidator, IValidatorFacade } from '../interfaces';
import { VALIDATOR_TYPES } from '../types';

@injectable()
export class CloneTemplateValidatorFacade implements IValidatorFacade {
  @inject(VALIDATOR_TYPES.CloneTemplateValidator)
  private _cloneTemplateValidator!: ICloneTemplateValidator;

  private _parameters!: { fn: (cloneTemplateName: string) => boolean; name: string }[];

  async validate(): Promise<void> {
    console.log('Clone templates validation has started');

    this._parameters = [
      { fn: this._cloneTemplateValidator.validateCloneTemplateTitle, name: 'title' },
      { fn: this._cloneTemplateValidator.validateCloneTemplateOverview, name: 'overview' },
    ];

    Object.keys(cloneTemplates).forEach((cloneTemplateName) => {
      if (cloneTemplateName === SCHEMA_PROPERTY) {
        return;
      }

      this.validateCloneTemplate(cloneTemplateName);
    });

    console.log('Clone templates validation has finished');
  }

  private validateCloneTemplate(cloneTemplateName: string) {
    this._parameters.forEach((parameter) => {
      const result = parameter.fn.call(this._cloneTemplateValidator, cloneTemplateName);

      if (!result) {
        this.printError(cloneTemplateName, parameter.name);
      }
    });
  }

  private printError(cloneTemplateName: string, error: string) {
    const text = `Clone template ${styleText('cyanBright', cloneTemplateName)} is missing ${styleText('redBright', error)}`;

    console.log(text);
  }
}
