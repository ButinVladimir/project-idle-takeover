import { inject, injectable } from 'inversify';
import constants from '@configs/constants.json';
import { decorators } from '@state/container';
import type { IStateUIConnector } from '@state/state-ui-connector/interfaces/state-ui-connector';
import { TYPES } from '@state/types';
import { moveElementInArray } from '@shared/helpers';
import {
  IMainframeHardwareState,
  IMainframeHardwareSerializedState,
  IMainframeHardwareParameter,
  type IMainframeHardwareUpgrader,
} from './interfaces';
import { MainframeHardwarePerformance } from './mainframe-hardware-performance';
import { MainframeHardwareCores } from './mainframe-hardware-cores';
import { MainframeHardwareRam } from './mainframe-hardware-ram';
import { MainframeHardwareParameterType } from './types';

const { lazyInject } = decorators;

@injectable()
export class MainframeHardwareState implements IMainframeHardwareState {
  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  @inject(TYPES.MainframeHardwareUpgrader)
  private _upgrader!: IMainframeHardwareUpgrader;

  @inject(TYPES.MainframeHardwarePerformance)
  private _performance!: MainframeHardwarePerformance;

  @inject(TYPES.MainframeHardwareRam)
  private _ram!: MainframeHardwareRam;

  @inject(TYPES.MainframeHardwareCores)
  private _cores!: MainframeHardwareCores;

  private _parametersList!: IMainframeHardwareParameter[];

  constructor() {
    this._parametersList = [];

    this.buildParametersList(
      constants.defaultAutomationSettings.mainframeHardwareAutobuyer.priority as MainframeHardwareParameterType[],
    );

    this._stateUiConnector.registerEventEmitter(this, ['_parametersList']);
  }

  get performance() {
    return this._performance;
  }

  get cores() {
    return this._cores;
  }

  get ram() {
    return this._ram;
  }

  get upgrader() {
    return this._upgrader;
  }

  listParameters(): IMainframeHardwareParameter[] {
    return this._parametersList;
  }

  moveParameter(parameterType: MainframeHardwareParameterType, newPosition: number) {
    const oldPosition = this._parametersList.findIndex((parameter) => parameter.type === parameterType);

    if (oldPosition === -1) {
      return;
    }

    moveElementInArray(this._parametersList, oldPosition, newPosition);
  }

  async startNewState(): Promise<void> {
    await this._performance.startNewState();
    await this._cores.startNewState();
    await this._ram.startNewState();

    this.buildParametersList(
      constants.defaultAutomationSettings.mainframeHardwareAutobuyer.priority as MainframeHardwareParameterType[],
    );
  }

  async deserialize(serializedState: IMainframeHardwareSerializedState): Promise<void> {
    await this._performance.deserialize(serializedState.performance);
    await this._cores.deserialize(serializedState.cores);
    await this._ram.deserialize(serializedState.ram);

    this.buildParametersList(serializedState.parametersList);
  }

  serialize(): IMainframeHardwareSerializedState {
    return {
      performance: this._performance.serialize(),
      cores: this._cores.serialize(),
      ram: this._ram.serialize(),
      parametersList: this._parametersList.map(this.serializeParameterType),
    };
  }

  private buildParametersList(parameterTypes: MainframeHardwareParameterType[]) {
    this._parametersList.length = 0;
    this._parametersList.push(...parameterTypes.map(this.getParameterByType));
  }

  private serializeParameterType = (parameter: IMainframeHardwareParameter): MainframeHardwareParameterType => {
    return parameter.type;
  };

  private getParameterByType = (type: MainframeHardwareParameterType): IMainframeHardwareParameter => {
    switch (type) {
      case 'performance':
        return this.performance;
      case 'cores':
        return this.cores;
      case 'ram':
        return this.ram;
    }
  };
}
