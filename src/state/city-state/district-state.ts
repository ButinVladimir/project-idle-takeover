import { type IStateUIConnector } from '@state/state-ui-connector';
import { IPoint } from '@shared/index';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import {
  IDistrictState,
  IDistrictSerializedState,
  IDistrictParameters,
  IDistrictArguments,
  IMapGeneratorDistrict,
  IDistrictCountersState,
} from './interfaces';
import { DistrictUnlockState } from './types';
import { DistrictParameters } from './parameters';
import { DistrictCountersState } from './counters';
import { typedDistrictTypes } from './constants';

const { lazyInject } = decorators;

export class DistrictState implements IDistrictState {
  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  private _index: number;
  private _name: string;
  private _startingPoint: IPoint;
  private _districtType: string;
  private _faction;
  private _state: DistrictUnlockState;
  private _parameters: IDistrictParameters;
  private _counters: IDistrictCountersState;

  constructor(args: IDistrictArguments) {
    this._index = args.index;
    this._name = args.name;
    this._startingPoint = args.startingPoint;
    this._districtType = args.districtType;
    this._faction = args.faction;
    this._state = args.state;
    this._parameters = new DistrictParameters(this);
    this._counters = new DistrictCountersState(this);

    this._stateUiConnector.registerEventEmitter(this, []);
  }

  static createByMapGenerator(districtInfo: IMapGeneratorDistrict): IDistrictState {
    const districtState = new DistrictState({
      districtType: districtInfo.districtType,
      faction: districtInfo.faction,
      index: districtInfo.index,
      name: districtInfo.name,
      startingPoint: districtInfo.startingPoint,
      state: districtInfo.isUnlocked ? DistrictUnlockState.contested : DistrictUnlockState.locked,
    });

    districtState._parameters.influence.tier = districtInfo.tier;

    return districtState;
  }

  static deserialize(index: number, serializedState: IDistrictSerializedState): IDistrictState {
    const districtState = new DistrictState({
      ...serializedState,
      index,
    });

    districtState._parameters.deserialize(serializedState.parameters);
    districtState._counters.deserialize(serializedState.counters);

    return districtState;
  }

  get index() {
    return this._index;
  }

  get template() {
    return typedDistrictTypes[this._districtType];
  }

  get name(): string {
    return this._name;
  }

  get startingPoint(): IPoint {
    return this._startingPoint;
  }

  get districtType(): string {
    return this._districtType;
  }

  get faction(): string {
    return this._faction;
  }

  get state(): DistrictUnlockState {
    return this._state;
  }

  set state(value: DistrictUnlockState) {
    this._state = value;
  }

  get parameters() {
    return this._parameters;
  }

  get counters() {
    return this._counters;
  }

  recalculate() {
    this._parameters.recalculate();
    this._counters.processTick();
  }

  serialize(): IDistrictSerializedState {
    return {
      name: this._name,
      startingPoint: this._startingPoint,
      districtType: this._districtType,
      faction: this._faction,
      state: this._state,
      parameters: this._parameters.serialize(),
      counters: this._counters.serialize(),
    };
  }

  removeAllEventListeners(): void {
    this._parameters.removeAllEventListeners();
    this._counters.removeAllEventListeners();
  }
}
