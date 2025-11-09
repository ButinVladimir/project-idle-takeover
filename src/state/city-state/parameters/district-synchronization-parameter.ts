import { calculatePower } from '@shared/index';
import { decorators } from '@state/container';
import { type IStateUIConnector } from '@state/state-ui-connector/interfaces';
import { TYPES } from '@state/types';
import { IDistrictState, IDistrictSynchronizationParameter } from '../interfaces';

const { lazyInject } = decorators;

export class DistrictSynchronizationParameter implements IDistrictSynchronizationParameter {
  @lazyInject(TYPES.StateUIConnector)
  private _stateUIConnector!: IStateUIConnector;

  private _district: IDistrictState;
  private _value: number;

  constructor(district: IDistrictState) {
    this._district = district;
    this._value = 0;

    this._stateUIConnector.registerEventEmitter(this, ['_value']);
  }

  get value(): number {
    return this._value;
  }

  recalculate(): void {
    const districtTypeData = this._district.template;

    this._value = Math.ceil(
      calculatePower(this._district.parameters.influence.tier, districtTypeData.parameters.synchronization),
    );
  }

  removeAllEventListeners(): void {
    this._stateUIConnector.unregisterEventEmitter(this);
  }
}
