import sidejobs from '@configs/sidejobs.json';
import { typeConfigEntries } from '@shared/index';
import { ISidejobTemplate } from './interfaces';

export const typedSidejobs = typeConfigEntries<ISidejobTemplate>(sidejobs);
