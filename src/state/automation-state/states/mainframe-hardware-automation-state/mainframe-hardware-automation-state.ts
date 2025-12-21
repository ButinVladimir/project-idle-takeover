import { injectable } from 'inversify';
import { checkPercentage, typedConstants } from '@shared/index';
import { IMainframeHardwareAutomationSerializedState, IMainframeHardwareAutomationState } from './interfaces';

@injectable()
export class MainframeHardwareAutomationState implements IMainframeHardwareAutomationState {
  private _moneyShare: number;

  constructor() {
    this._moneyShare = typedConstants.defaultAutomationSettings.mainframeHardwareAutobuyer.moneyShare;
  }

  get moneyShare() {
    return this._moneyShare;
  }

  set moneyShare(value: number) {
    if (checkPercentage(value)) {
      this._moneyShare = value;
    }
  }

  async startNewState(): Promise<void> {
    this._moneyShare = typedConstants.defaultAutomationSettings.mainframeHardwareAutobuyer.moneyShare;
  }

  async deserialize(serializedState: IMainframeHardwareAutomationSerializedState): Promise<void> {
    this._moneyShare = serializedState.moneyShare;
  }

  serialize(): IMainframeHardwareAutomationSerializedState {
    return {
      moneyShare: this._moneyShare,
    };
  }
}
