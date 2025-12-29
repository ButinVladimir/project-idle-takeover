import Ajv from 'ajv';

export interface IValidatorFacade {
  validate(ajv: Ajv): Promise<void>;
}
