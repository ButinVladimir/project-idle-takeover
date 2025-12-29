import contracts from '@configs/contracts.json';
import { typeConfigEntries } from '@shared/index';
import { IContractTemplate } from './interfaces';

export const typedContracts = typeConfigEntries<IContractTemplate>(contracts);
