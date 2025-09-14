import districtTypes from '@configs/district-types.json';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { IPoint, DistrictType, Faction } from '@shared/index';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import {
  IDistrictState,
  IDistrictSerializedState,
  IDistrictParameters,
  IDistrictTypeTemplate,
  IDistrictArguments,
  IMapGeneratorDistrict,
} from './interfaces';
import { DistrictUnlockState } from './types';
import { DistrictParameters } from './district-parameters';

const { lazyInject } = decorators;

export class DistrictState implements IDistrictState {
  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  private _index: number;
  private _name: string;
  private _startingPoint: IPoint;
  private _districtType: DistrictType;
  private _faction;
  private _state: DistrictUnlockState;
  private _parameters: IDistrictParameters;

  private _template: IDistrictTypeTemplate;

  constructor(args: IDistrictArguments) {
    this._index = args.index;
    this._name = args.name;
    this._startingPoint = args.startingPoint;
    this._districtType = args.districtType;
    this._faction = args.faction;
    this._state = args.state;
    this._parameters = new DistrictParameters(this);

    this._template = districtTypes[this._districtType] as IDistrictTypeTemplate;

    this._stateUiConnector.registerEventEmitter(this, []);
  }

  static createByMapGenerator(districtInfo: IMapGeneratorDistrict): IDistrictState {
    const districtState = new DistrictState({
      districtType: districtInfo.districtType,
      faction: districtInfo.faction,
      index: districtInfo.index,
      name: districtInfo.name,
      startingPoint: districtInfo.startingPoint,
      state: districtInfo.isStartingDistrict ? DistrictUnlockState.contested : DistrictUnlockState.locked,
    });

    districtState._parameters.tier.setTier(districtInfo.tier);

    return districtState;
  }

  static deserialize(index: number, serializedState: IDistrictSerializedState): IDistrictState {
    const districtState = new DistrictState({
      ...serializedState,
      index,
    });

    districtState._parameters.deserialize(serializedState.parameters);

    return districtState;
  }

  get index() {
    return this._index;
  }

  get template() {
    return this._template;
  }

  get name(): string {
    return this._name;
  }

  get startingPoint(): IPoint {
    return this._startingPoint;
  }

  get districtType(): DistrictType {
    return this._districtType;
  }

  get faction(): Faction {
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

  recalculate() {
    this._parameters.recalculate();
  }

  serialize(): IDistrictSerializedState {
    return {
      name: this._name,
      startingPoint: this._startingPoint,
      districtType: this._districtType,
      faction: this._faction,
      state: this._state,
      parameters: this._parameters.serialize(),
    };
  }

  removeAllEventListeners(): void {
    this._parameters.removeAllEventListeners();
  }
}
