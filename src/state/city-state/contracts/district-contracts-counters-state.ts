import { injectable } from 'inversify';
import { TYPES } from '@state/types';
import { decorators } from '@state/container';
import { type IGlobalState } from '@state/global-state';
import { type ISettingsState } from '@state/settings-state';
import { type IUnlockState } from '@state/unlock-state';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { typedContracts } from '@state/company-state';
import { calculatePower } from '@shared/index';
import {
  IDistrictContractsCountersSerializedState,
  IDistrictContractsCountersState,
  type IDistrictState,
} from '../interfaces';

const { lazyInject } = decorators;

@injectable()
export class DistrictContractsCountersState implements IDistrictContractsCountersState {
  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  @lazyInject(TYPES.SettingsState)
  private _settingsState!: ISettingsState;

  @lazyInject(TYPES.UnlockState)
  private _unlockState!: IUnlockState;

  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  private _districtState: IDistrictState;
  private _passedTimesMap: Map<string, number>;
  private _availableAmountsMap: Map<string, number>;

  constructor(districtState: IDistrictState) {
    this._districtState = districtState;

    this._passedTimesMap = new Map<string, number>();
    this._availableAmountsMap = new Map<string, number>();

    this._stateUiConnector.registerEventEmitter(this, ['_availableAmountsMap']);
  }

  getPassedGenerationTime(contractName: string): number {
    return this._passedTimesMap.get(contractName) ?? 0;
  }

  getRequiredGenerationTime(contractName: string): number {
    return (
      this._districtState.template.primaryActivityimeMultipliers.generationTime *
      typedContracts[contractName].requirements.baseCompletionTime
    );
  }

  getAvailableAmount(contractName: string): number {
    return this._availableAmountsMap.get(contractName) ?? 0;
  }

  getChance(contractName: string): number {
    const connectivitySettings = typedContracts[contractName].requirements.connectivity;

    const requiredConnectivity =
      calculatePower(this._globalState.threat.level, connectivitySettings.threat) *
      calculatePower(this.getAvailableAmount(contractName), connectivitySettings.amount);

    return Math.min(this._districtState.parameters.connectivity.totalValue / requiredConnectivity, 1);
  }

  processTick(): void {
    const availableActivities = this._unlockState.activities.contracts.listAvailableActivities();

    availableActivities.forEach((contractName) => {
      this.processContract(contractName);
    });
  }

  serialize(): IDistrictContractsCountersSerializedState {
    return {
      passedTimes: Object.fromEntries(this._passedTimesMap.entries()),
      availableAmounts: Object.fromEntries(this._availableAmountsMap.entries()),
    };
  }

  deserialize(serializedState: IDistrictContractsCountersSerializedState): void {
    this._passedTimesMap.clear();

    Object.entries(serializedState.passedTimes).forEach(([contract, time]) => {
      this._passedTimesMap.set(contract, time);
    });

    this._availableAmountsMap.clear();

    Object.entries(serializedState.availableAmounts).forEach(([contract, amount]) => {
      this._availableAmountsMap.set(contract, amount);
    });
  }

  private processContract(contractName: string) {
    let newTime = this.getPassedGenerationTime(contractName) + this._settingsState.updateInterval;
    const requiredTime = this.getRequiredGenerationTime(contractName);

    while (newTime >= requiredTime) {
      newTime -= requiredTime;
      this.generateContract(contractName);
    }

    newTime = Math.max(newTime, 0);

    this._passedTimesMap.set(contractName, newTime);
  }

  private generateContract(contractName: string) {
    const chance = this.getChance(contractName);
    const successful = this._globalState.random.coin(chance);

    if (successful) {
      this._availableAmountsMap.set(contractName, this.getAvailableAmount(contractName) + 1);
    }
  }
}
