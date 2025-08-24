import { decorators } from '@state/container';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { TYPES } from '@state/types';
import { type ICompanyState } from '@state/company-state';
import { IDistrictProcessCompletionSpeedParameter, IDistrictState } from '../interfaces';

const { lazyInject } = decorators;

export class DistrictProcessCompletionSpeedParameter implements IDistrictProcessCompletionSpeedParameter {
  @lazyInject(TYPES.StateUIConnector)
  private _stateUIConnector!: IStateUIConnector;

  @lazyInject(TYPES.CompanyState)
  private _companyState!: ICompanyState;

  private _district: IDistrictState;
  private _value: number;

  constructor(district: IDistrictState) {
    this._district = district;
    this._value = 1;

    this._stateUIConnector.registerEventEmitter(this, ['_value']);
  }

  get value(): number {
    return this._value;
  }

  recalculate(): void {
    this._value = 1;

    for (const sidejob of this._companyState.sidejobs.listSidejobs()) {
      if (sidejob.district.index === this._district.index && sidejob.isActive) {
        this._value += sidejob.calculateProcessCompletionSpeedDelta();
      }
    }
  }

  removeAllEventListeners(): void {
    this._stateUIConnector.unregisterEventEmitter(this);
  }
}
