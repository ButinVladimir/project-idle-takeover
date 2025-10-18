import 'reflect-metadata';
import '@validators/bindings';
import { validatorContainer, VALIDATOR_TYPES, IValidatorFacade } from '@validators/index';

const validatorFacade: IValidatorFacade = validatorContainer.get(VALIDATOR_TYPES.ValidatorFacade);

validatorFacade.validate();
