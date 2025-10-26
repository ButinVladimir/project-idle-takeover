import 'reflect-metadata';
import '@validators/bindings';
import { validatorContainer, VALIDATOR_TYPES, IMainValidatorFacade } from '@validators/index';

const validatorFacade: IMainValidatorFacade = validatorContainer.get(VALIDATOR_TYPES.MainValidatorFacade);

validatorFacade.validate();
