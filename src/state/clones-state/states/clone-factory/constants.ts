import cloneTemplates from '@configs/clone-templates.json';
import { typeConfigEntries } from '@shared/index';
import { ICloneTemplate } from './interfaces';

export const typedCloneTemplates = typeConfigEntries<ICloneTemplate>(cloneTemplates);
