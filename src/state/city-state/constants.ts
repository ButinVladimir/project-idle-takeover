import districtTypes from '@configs/district-types.json';
import { typeConfigEntries } from '@shared/index';
import { IDistrictTypeTemplate } from './interfaces';

export const typedDistrictTypes = typeConfigEntries<IDistrictTypeTemplate>(districtTypes);
