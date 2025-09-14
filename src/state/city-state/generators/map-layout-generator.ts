import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { type IScenarioState } from '@state/scenario-state';
import { type IGlobalState } from '@state/global-state';
import { TYPES } from '@state/types';
import { IPoint, RandomQueue } from '@shared/index';
import { IMapLayoutGenerator, IMapLayoutGeneratorResult, IMapLayoutGeneratorDistrict } from '../interfaces';

const { lazyInject } = decorators;

@injectable()
export class MapLayoutGenerator implements IMapLayoutGenerator {
  @lazyInject(TYPES.ScenarioState)
  private _scenarioState!: IScenarioState;

  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  private static DX: number[] = [-1, 1, 0, 0];
  private static DY: number[] = [0, 0, -1, 1];
  private _map!: (number | undefined)[][];
  private _districts!: Map<number, IMapLayoutGeneratorDistrict>;

  private get _mapWidth() {
    return this._scenarioState.currentValues.map.width;
  }

  private get _mapHeight() {
    return this._scenarioState.currentValues.map.height;
  }

  private get _districtsNum() {
    return this._scenarioState.currentValues.map.districts.length;
  }

  private get _random() {
    return this._globalState.random;
  }

  public async generate(): Promise<IMapLayoutGeneratorResult> {
    return new Promise((resolve) => {
      resolve(this.generateImplementation());
    });
  }

  private generateImplementation(): IMapLayoutGeneratorResult {
    this.initMap();
    this.initDistricts();

    this.setStartingPoints();
    this.expandDistricts();

    return this.buildResult();
  }

  private initMap() {
    this._map = [];
    for (let x = 0; x < this._mapWidth; x++) {
      const row = [];

      for (let y = 0; y < this._mapHeight; y++) {
        row[y] = undefined;
      }

      this._map[x] = row;
    }
  }

  private initDistricts() {
    this._districts = new Map<number, IMapLayoutGeneratorDistrict>();
  }

  private setStartingPoints(): void {
    const startingPoints: IPoint[] = [];

    for (let x = 0; x < this._mapWidth; x++) {
      for (let y = 0; y < this._mapHeight; y++) {
        startingPoints.push({ x, y });
      }
    }
    this._random.shuffle(startingPoints, true);

    for (let districtNum = 0; districtNum < this._districtsNum; districtNum++) {
      const queue = new RandomQueue<IPoint>(this._random);
      const startingPoint = startingPoints.shift()!;

      this._map[startingPoint.x][startingPoint.y] = districtNum;

      const nextPoints = this.buildNextPoints(startingPoint);
      nextPoints.forEach((nextPoint) => {
        queue.push(nextPoint);
      });

      this._districts.set(districtNum, {
        queue,
        startingPoint,
      });
    }
  }

  private expandDistricts(): void {
    let freeCells = this._mapWidth * this._mapHeight - this._districtsNum;

    while (freeCells > 0) {
      for (let districtNum = 0; districtNum < this._districtsNum; districtNum++) {
        const district = this._districts.get(districtNum);

        while (!district!.queue.isEmpty()) {
          const attemptPoint = district!.queue.pop();

          if (this._map[attemptPoint.x][attemptPoint.y] === undefined) {
            freeCells--;
            this._map[attemptPoint.x][attemptPoint.y] = districtNum;

            const nextPoints = this.buildNextPoints(attemptPoint);
            nextPoints.forEach((nextPoint) => {
              district!.queue.push(nextPoint);
            });
            break;
          }
        }
      }
    }
  }

  private buildResult(): IMapLayoutGeneratorResult {
    return {
      layout: this._map as number[][],
      districts: this._districts,
    };
  }

  private buildNextPoints(point: IPoint): IPoint[] {
    const result: IPoint[] = [];

    for (let direction = 0; direction < MapLayoutGenerator.DX.length; direction++) {
      const nextPoint = {
        x: point.x + MapLayoutGenerator.DX[direction],
        y: point.y + MapLayoutGenerator.DY[direction],
      };

      if (nextPoint.x >= 0 && nextPoint.y >= 0 && nextPoint.x < this._mapWidth && nextPoint.y < this._mapHeight) {
        result.push(nextPoint);
      }
    }

    return result;
  }
}
