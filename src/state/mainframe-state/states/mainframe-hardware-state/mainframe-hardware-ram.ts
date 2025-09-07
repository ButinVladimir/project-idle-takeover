import { injectable } from 'inversify';
import { msg, str } from '@lit/localize';
import { IExponent } from '@shared/interfaces';
import { ProgramsEvent } from '@shared/types';
import { MainframeHardwareParameter } from './mainframe-hardware-parameter';
import { MainframeHardwareParameterType } from './types';

@injectable()
export class MainframeHardwareRam extends MainframeHardwareParameter {
  readonly type: MainframeHardwareParameterType = 'ram';

  protected get baseLevel(): number {
    return this.scenarioState.currentValues.mainframeHardware.baseRamLevel;
  }

  protected get priceExp(): IExponent {
    return this.scenarioState.currentValues.mainframeHardware.ramPrice;
  }

  protected postPurchaseMessge(): void {
    const formattedLevel = this.formatter.formatLevel(this._level);

    this.messageLogState.postMessage(
      ProgramsEvent.ramUpgraded,
      msg(str`Mainframe RAM has been upgraded to ${formattedLevel}`),
    );
  }
}
