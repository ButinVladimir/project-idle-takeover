import { injectable } from 'inversify';
import scenarios from '@configs/scenarios.json';
import { type IGlobalState } from '@state/global-state';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { type IScenarioState } from '@state/scenario-state';
import { IMapGeneratorResult } from '@workers/map-generator/interfaces';
import { TYPES } from '@state/types';
import { decorators } from '@state/container';
import { ICityState, ICitySerializedState, IDistrictState, IDistrictSerializedState } from './interfaces';
import { DistrictState } from './district-state';
import { DistrictUnlockState } from './types';

const { lazyInject } = decorators;

@injectable()
export class CityState implements ICityState {
  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  @lazyInject(TYPES.ScenarioState)
  private _scenarioState!: IScenarioState;

  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  private _layout: number[][];
  private _districts: Map<number, IDistrictState>;
  private _availableDistricts: IDistrictState[];

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
    if (!this._districts.has(districtIndex)) {
      throw new Error(`Missing district ${districtIndex}`);
    }

    return this._districts.get(districtIndex)!;
  }

  listAvailableDistricts(): IDistrictState[] {
    return this._availableDistricts;
  }

  recalculate() {
    for (const district of this._districts.values()) {
      district.recalculate();
    }
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

  private generateMap(): Promise<void> {
    return new Promise((resolve, reject) => {
      const worker = new Worker(new URL('@workers/map-generator/index.js', import.meta.url), { type: 'module' });

      worker.addEventListener('message', (event: MessageEvent<IMapGeneratorResult>) => {
        this._globalState.random.y = event.data.randomShift;

        this._layout = event.data.layout;

        this.clearDistricts();

        for (const [districtIndex, district] of Object.entries(event.data.districts)) {
          const parsedDistrictIndex = parseInt(districtIndex);
          const districtState = DistrictState.createByMapGenerator(parsedDistrictIndex, district);

          districtState.state =
            parsedDistrictIndex === scenarios[this._scenarioState.currentScenario].map.startingDistrict
              ? DistrictUnlockState.contested
              : DistrictUnlockState.locked;

          this._districts.set(parsedDistrictIndex, districtState);
        }

        this.updateAvailableDistricts();

        worker.terminate();

        resolve();
      });

      worker.addEventListener('error', (event: ErrorEvent) => {
        reject(event.error);
      });

      worker.addEventListener('messageerror', () => {
        reject('Unable to parse map generator message');
      });

      worker.postMessage({
        scenario: this._scenarioState.currentScenario,
        randomSeed: this._globalState.random.seed,
        randomShift: this._globalState.random.y,
      });
    });
  }

  private updateAvailableDistricts() {
    this._availableDistricts.length = 0;

    this._districts.forEach((district) => {
      if (district.state !== DistrictUnlockState.locked) {
        this._availableDistricts.push(district);
      }
    });
  }

  private clearDistricts() {
    for (const district of this._districts.values()) {
      district.removeAllEventListeners();
    }

    this._availableDistricts.length = 0;
    this._districts.clear();
  }
}
