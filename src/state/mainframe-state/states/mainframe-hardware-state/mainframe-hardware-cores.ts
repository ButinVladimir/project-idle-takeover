import { injectable } from 'inversify';
import { msg, str } from '@lit/localize';
import { IExponent } from '@shared/interfaces';
import { ProgramsEvent } from '@shared/types';
import { MainframeHardwareParameter } from './mainframe-hardware-parameter';
import { MainframeHardwareParameterType } from './types';

@injectable()
export class MainframeHardwareCores extends MainframeHardwareParameter {
  readonly type: MainframeHardwareParameterType = 'cores';

  protected get baseLevel(): number {
    return this.scenarioState.currentValues.mainframeHardware.baseCoresLevel;
  }

  protected get priceExp(): IExponent {
    return this.scenarioState.currentValues.mainframeHardware.coresPrice;
  }

  protected handlePostUpgrade(): void {
    this.mainframeState.processes.requestUpdateRunningProcesses();
  }

  protected postPurchaseMessage(): void {
    const formattedLevel = this.formatter.formatLevel(this._level);

    this.messageLogState.postMessage(
      ProgramsEvent.coresUpgraded,
      msg(str`Mainframe cores has been upgraded to ${formattedLevel}`),
    );
  }
}
