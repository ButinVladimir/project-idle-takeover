import Ajv from 'ajv';
import { inject, injectable } from 'inversify';
import { styleText } from 'node:util';
import contractsSchema from '@configs/schemas/contracts.json';
import { typedContracts } from '@state/company-state';
import { type IContractValidator, IValidatorFacade } from '../interfaces';
import { VALIDATOR_TYPES } from '../types';

@injectable()
export class ContractValidatorFacade implements IValidatorFacade {
  @inject(VALIDATOR_TYPES.ContractValidator)
  private _contractValidator!: IContractValidator;

  async validate(ajv: Ajv): Promise<void> {
    console.log('Contracts validation has started');

    await this.validateSchema(ajv);
    this.validateContracts();

    console.log('Contracts validation has finished');
  }

  private async validateSchema(ajv: Ajv): Promise<void> {
    console.log(`\tValidating ${styleText('cyanBright', 'contracts schema')}`);

    const validate = await ajv.compile(contractsSchema);

    if (!validate(typedContracts)) {
      console.log(`\t\t${styleText('cyanBright', 'Contracts schema')} is ${styleText('redBright', 'incorrect')}`);
      console.error(validate.errors);
    }
  }

  private validateContracts() {
    Object.keys(typedContracts).forEach((contractName) => {
      this._contractValidator.validate(contractName);
    });
  }
}
