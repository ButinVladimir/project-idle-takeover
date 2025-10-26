import Ajv from 'ajv';
import { inject, injectable } from 'inversify';
import { styleText } from 'node:util';
import cloneTemplates from '@configs/clone-templates.json';
import cloneTemplatesSchema from '@configs/schemas/clone-templates.json';
import { SCHEMA_PROPERTY } from '@shared/index';
import { type ICloneTemplateValidator, IValidatorFacade } from '../interfaces';
import { VALIDATOR_TYPES } from '../types';

@injectable()
export class CloneTemplateValidatorFacade implements IValidatorFacade {
  @inject(VALIDATOR_TYPES.CloneTemplateValidator)
  private _cloneTemplateValidator!: ICloneTemplateValidator;

  private _parameters!: { fn: (cloneTemplateName: string) => boolean; name: string }[];

  async validate(ajv: Ajv): Promise<void> {
    console.log('Clone templates validation has started');

    await this.validateSchema(ajv);
    this.validateCloneTemplates();

    console.log('Clone templates validation has finished');
  }

  private async validateSchema(ajv: Ajv): Promise<void> {
    console.log(`\tValidating ${styleText('cyanBright', 'clone templates schema')}`);

    const validate = await ajv.compile(cloneTemplatesSchema);

    if (!validate(cloneTemplates)) {
      console.log(`\t\t${styleText('cyanBright', 'Clone templates schema')} is ${styleText('redBright', 'incorrect')}`);
      console.error(validate.errors);
    }
  }

  private validateCloneTemplates() {
    Object.keys(cloneTemplates).forEach((cloneTemplateName) => {
      if (cloneTemplateName === SCHEMA_PROPERTY) {
        return;
      }

      this._cloneTemplateValidator.validate(cloneTemplateName);
    });
  }
}
