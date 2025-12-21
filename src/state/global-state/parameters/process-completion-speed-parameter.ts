import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { type IMainframeState, OtherProgramName, PredictiveComputatorProgram } from '@state/mainframe-state';
import { type ICityState } from '@state/city-state';
import { type IScenarioState } from '@state/scenario-state';
import { calculateLinear } from '@shared/index';
import { IProcessCompletionSpeedState } from '../interfaces';

const { lazyInject } = decorators;

@injectable()
export class ProcessCompletionSpeedState implements IProcessCompletionSpeedState {
  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  @lazyInject(TYPES.ScenarioState)
  private _scenarioState!: IScenarioState;

  @lazyInject(TYPES.MainframeState)
  private _mainframeState!: IMainframeState;

  @lazyInject(TYPES.CityState)
  private _cityState!: ICityState;

  private _multiplierByProgram: number;
  private _multiplierByHardware: number;
  private _totalMultiplier: number;

  constructor() {
    this._multiplierByProgram = 1;
    this._multiplierByHardware = 1;
    this._totalMultiplier = 1;

    this._stateUiConnector.registerEventEmitter(this, ['_multiplierByHardware']);
  }

  get multiplierByProgram() {
    return this._multiplierByProgram;
  }

  get multiplierByHardware() {
    return this._multiplierByHardware;
  }

  get totalMultiplier() {
    return this._totalMultiplier;
  }

  recalculate() {
    this._totalMultiplier = 1;

    this.updateMultiplierByProgram();
    this.updateMultiplierByHardware();
    this.updateDistrictMultipliers();
  }

  private updateMultiplierByProgram() {
    const mainframeProcessesState = this._mainframeState.processes;

    const predictiveComputatorProcess = mainframeProcessesState.getProcessByName(OtherProgramName.predictiveComputator);

    let multiplierByProgram = 1;

    if (predictiveComputatorProcess?.enabled) {
      const predictiveComputatorProgram = predictiveComputatorProcess.program as PredictiveComputatorProgram;

      multiplierByProgram = predictiveComputatorProgram.calculateProcessCompletionSpeedMultiplier(
        predictiveComputatorProcess.usedCores,
        predictiveComputatorProcess.totalRam,
      );
    }

    this._multiplierByProgram = multiplierByProgram;
    this._totalMultiplier *= multiplierByProgram;
  }

  private updateMultiplierByHardware() {
    const mainframeHardwareState = this._mainframeState.hardware;

    const multiplierByHardware = calculateLinear(
      mainframeHardwareState.performance.totalLevel,
      this._scenarioState.currentValues.mainframeSoftware.performanceBoost,
    );

    this._multiplierByHardware = multiplierByHardware;
    this._totalMultiplier *= multiplierByHardware;
  }

  private updateDistrictMultipliers() {
    for (const district of this._cityState.listAvailableDistricts()) {
      district.parameters.processCompletionSpeed.recalculate();

      this._totalMultiplier *= district.parameters.processCompletionSpeed.value;
    }
  }
}
