import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { type IScenarioState } from '@state/scenario-state';
import {
  type ICityState,
  IDistrictConnectionGraphGenerator,
  IDistrictConnectionGraphGeneratorResult,
} from '../interfaces';

const { lazyInject } = decorators;

@injectable()
export class DistrictConnectionGraphGenerator implements IDistrictConnectionGraphGenerator {
  @lazyInject(TYPES.CityState)
  private _cityState!: ICityState;

  @lazyInject(TYPES.ScenarioState)
  private _scenarioState!: IScenarioState;

  private _connections!: Map<number, Set<number>>;
  private _districtSizes!: Map<number, number>;

  private get _width() {
    return this._scenarioState.currentValues.map.width;
  }

  private get _height() {
    return this._scenarioState.currentValues.map.height;
  }

  private get _layout() {
    return this._cityState.getLayout();
  }

  async generate(): Promise<IDistrictConnectionGraphGeneratorResult> {
    return new Promise((resolve) => {
      resolve(this.generateImplementation());
    });
  }

  private generateImplementation(): IDistrictConnectionGraphGeneratorResult {
    this.init();
    this.buildConnections();
    this.calculateDistrictSizes();

    return {
      connections: this._connections,
      districtSizes: this._districtSizes,
    };
  }

  private init() {
    this._connections = new Map<number, Set<number>>();
    this._districtSizes = new Map<number, number>();
  }

  private buildConnections() {
    const districtsNum = this._scenarioState.currentValues.map.districts.length;

    for (let i = 0; i < districtsNum; i++) {
      this._connections.set(i, new Set<number>());
    }

    for (let x = 0; x < this._width; x++) {
      for (let y = 0; y < this._height; y++) {
        this.connectPosition(x, y);
      }
    }
  }

  private connectPosition(x: number, y: number) {
    const districtFrom = this._layout[x][y];

    if (x < this._width - 1) {
      const districtTo = this._layout[x + 1][y];

      this.connectDistricts(districtFrom, districtTo);
    }

    if (y < this._height - 1) {
      const districtTo = this._layout[x][y + 1];

      this.connectDistricts(districtFrom, districtTo);
    }
  }

  private connectDistricts(districtFrom: number, districtTo: number) {
    if (districtFrom !== districtTo) {
      this._connections.get(districtFrom)!.add(districtTo);
      this._connections.get(districtTo)!.add(districtFrom);
    }
  }

  private calculateDistrictSizes() {
    const districtsNum = this._scenarioState.currentValues.map.districts.length;

    for (let i = 0; i < districtsNum; i++) {
      this._districtSizes.set(i, 0);
    }

    let district: number;

    for (let x = 0; x < this._width; x++) {
      for (let y = 0; y < this._height; y++) {
        district = this._layout[x][y];
        this._districtSizes.set(district, this._districtSizes.get(district)! + 1);
      }
    }
  }
}
