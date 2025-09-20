import { inject, injectable } from 'inversify';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { type IScenarioState } from '@state/scenario-state';
import { type IFactionState } from '@state/faction-state';
import { type IGlobalState } from '@state/global-state';
import { TYPES } from '@state/types';
import { decorators } from '@state/container';
import { Faction } from '@shared/index';
import {
  ICityState,
  ICitySerializedState,
  IDistrictState,
  IDistrictSerializedState,
  type IMapLayoutGenerator,
  type IDistrictInfoGenerator,
  IDistrictConnectionGraphGeneratorResult,
  type IDistrictConnectionGraphGenerator,
  type IDistrictFactionsGenerator,
} from './interfaces';
import { DistrictState } from './district-state';
import { DistrictUnlockState } from './types';

const { lazyInject } = decorators;

@injectable()
export class CityState implements ICityState {
  @inject(TYPES.MapLayoutGenerator)
  private _mapLayoutGenerator!: IMapLayoutGenerator;

  @inject(TYPES.DistrictInfoGenerator)
  private _districtInfoGenerator!: IDistrictInfoGenerator;

  @inject(TYPES.DistrictConnectionGraphGenerator)
  private _districtConnectionGraphGenerator!: IDistrictConnectionGraphGenerator;

  @inject(TYPES.DistrictFactionsGenerator)
  private _districtFactionsGenerator!: IDistrictFactionsGenerator;

  @lazyInject(TYPES.ScenarioState)
  private _scenarioState!: IScenarioState;

  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  @lazyInject(TYPES.FactionState)
  private _factionState!: IFactionState;

  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  private _layout: number[][];
  private _districts: Map<number, IDistrictState>;
  private _availableDistricts: IDistrictState[];
  private _districtConnections!: IDistrictConnectionGraphGeneratorResult;

  constructor() {
    this._layout = [];
    this._districts = new Map();
    this._availableDistricts = [];

    this._stateUiConnector.registerEventEmitter(this, []);
  }

  get districtsCount() {
    return this._scenarioState.currentValues.map.districts.length;
  }

  getLayout(): number[][] {
    return this._layout;
  }

  getDistrictState(districtIndex: number): IDistrictState {
    if (!this.checkDistrictIndex(districtIndex)) {
      throw new Error(`Invalid district index ${districtIndex}`);
    }

    return this._districts.get(districtIndex)!;
  }

  getDistrictSize(districtIndex: number): number {
    if (!this.checkDistrictIndex(districtIndex)) {
      throw new Error(`Invalid district index ${districtIndex}`);
    }

    return this._districtConnections.districtSizes.get(districtIndex)!;
  }

  getDistrictConnections(districtIndex: number): Set<number> {
    if (!this.checkDistrictIndex(districtIndex)) {
      throw new Error(`Invalid district index ${districtIndex}`);
    }

    return this._districtConnections.connections.get(districtIndex)!;
  }

  listAvailableDistricts(): IDistrictState[] {
    return this._availableDistricts;
  }

  recalculate() {
    for (const district of this._districts.values()) {
      district.recalculate();
    }
  }

  updateDistrictsAfterJoiningFaction(faction: Faction) {
    for (const district of this._districts.values()) {
      if (district.faction === faction && district.state === DistrictUnlockState.locked) {
        district.state = DistrictUnlockState.contested;
      }
    }

    this.updateAvailableDistricts();
  }

  async startNewState(): Promise<void> {
    await this.generateMap();
    this.recalculate();
  }

  async deserialize(serializedState: ICitySerializedState): Promise<void> {
    this.clearDistricts();

    this._layout = [];
    for (let x = 0; x < this._scenarioState.currentValues.map.width; x++) {
      const row: number[] = [];

      for (let y = 0; y < this._scenarioState.currentValues.map.height; y++) {
        row.push(serializedState.layout[x][y]);
      }

      this._layout.push(row);
    }

    Object.entries(serializedState.districts).forEach(([districtIndex, districtSerializedInfo]) => {
      const parsedDistrictIndex = parseInt(districtIndex);
      const districtState = DistrictState.deserialize(parsedDistrictIndex, districtSerializedInfo);

      this._districts.set(parsedDistrictIndex, districtState);
    });

    this._districtConnections = await this._districtConnectionGraphGenerator.generate();

    this.updateAvailableDistricts();
  }

  serialize(): ICitySerializedState {
    const layout: number[][] = this.getLayout();

    const districts: Record<number, IDistrictSerializedState> = {};
    this._districts.forEach((districtState, districtNum) => {
      districts[districtNum] = districtState.serialize();
    });

    return {
      layout,
      districts,
    };
  }

  private checkDistrictIndex(districtIndex: number): boolean {
    return districtIndex >= 0 && districtIndex < this._scenarioState.currentValues.map.districts.length;
  }

  private async generateMap(): Promise<void> {
    const mapLayoutGeneratorResult = await this._mapLayoutGenerator.generate();
    this._layout = mapLayoutGeneratorResult.layout;

    const districtInfoGeneratorResult = await this._districtInfoGenerator.generate();

    this._districtConnections = await this._districtConnectionGraphGenerator.generate();

    const districtFactionGeneratorResult = await this._districtFactionsGenerator.generate(districtInfoGeneratorResult);

    this.clearDistricts();

    const mapValues = this._scenarioState.currentValues.map;
    const startingDistrict = mapValues.factions[mapValues.startingFactionIndex].startingDistrict;
    const startingFaction = this._factionState.getFactionByIndex(mapValues.startingFactionIndex);

    for (
      let districtIndex = 0;
      districtIndex < this._scenarioState.currentValues.map.districts.length;
      districtIndex++
    ) {
      const startingPoint = mapLayoutGeneratorResult.districts.get(districtIndex)!.startingPoint;
      const districtInfo = districtInfoGeneratorResult.districts.get(districtIndex)!;
      const faction = this._factionState.getFactionByIndex(
        districtFactionGeneratorResult.districts.get(districtIndex)!,
      );

      const isUnlocked = startingDistrict === districtIndex;

      const district = DistrictState.createByMapGenerator({
        index: districtIndex,
        startingPoint,
        faction,
        isUnlocked,
        ...districtInfo,
      });

      this._districts.set(districtIndex, district);
    }

    if (startingFaction !== Faction.neutral) {
      this.updateDistrictsAfterJoiningFaction(startingFaction);
    } else {
      this.updateAvailableDistricts();
    }
  }

  private updateAvailableDistricts() {
    this._availableDistricts.length = 0;

    this._districts.forEach((district) => {
      if (district.state !== DistrictUnlockState.locked) {
        this._availableDistricts.push(district);
      }
    });

    this._globalState.synchronization.requestRecalculation();
  }

  private clearDistricts() {
    for (const district of this._districts.values()) {
      district.removeAllEventListeners();
    }

    this._availableDistricts.length = 0;
    this._districts.clear();
  }
}
