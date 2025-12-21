import { injectable, inject } from 'inversify';
import { TYPES } from '@state/types';
import { IAutomationSerializedState, IAutomationState } from './interfaces';
import type {
  IMainframeHardwareAutomationState,
  IMainframeProgramsAutomationState,
  ICloneLevelAutomationState,
  IContractsAutomationState,
} from './states';

@injectable()
export class AutomationState implements IAutomationState {
  @inject(TYPES.MainframeHardwareAutomationState)
  private _mainframeHardwareAutomationState!: IMainframeHardwareAutomationState;

  @inject(TYPES.MainframeProgramsAutomationState)
  private _mainframeProgramsAutomationState!: IMainframeProgramsAutomationState;

  @inject(TYPES.CloneLevelAutomationState)
  private _cloneLevelAutomationState!: ICloneLevelAutomationState;

  @inject(TYPES.ContractsAutomationState)
  private _contractsAutomationState!: IContractsAutomationState;

  get mainframeHardware() {
    return this._mainframeHardwareAutomationState;
  }

  get mainframePrograms() {
    return this._mainframeProgramsAutomationState;
  }

  get cloneLevel() {
    return this._cloneLevelAutomationState;
  }

  get contracts() {
    return this._contractsAutomationState;
  }

  async startNewState(): Promise<void> {
    await this._mainframeHardwareAutomationState.startNewState();
    await this._mainframeProgramsAutomationState.startNewState();
    await this._cloneLevelAutomationState.startNewState();
    await this._contractsAutomationState.startNewState();
  }

  async deserialize(serializedState: IAutomationSerializedState): Promise<void> {
    await this._mainframeHardwareAutomationState.deserialize(serializedState.mainframeHardware);
    await this._mainframeProgramsAutomationState.deserialize(serializedState.mainframePrograms);
    await this._cloneLevelAutomationState.deserialize(serializedState.cloneLevel);
    await this._contractsAutomationState.deserialize(serializedState.contracts);
  }

  serialize(): IAutomationSerializedState {
    return {
      mainframeHardware: this._mainframeHardwareAutomationState.serialize(),
      mainframePrograms: this._mainframeProgramsAutomationState.serialize(),
      cloneLevel: this._cloneLevelAutomationState.serialize(),
      contracts: this._contractsAutomationState.serialize(),
    };
  }
}
