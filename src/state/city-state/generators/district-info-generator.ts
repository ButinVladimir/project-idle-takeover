import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { type IScenarioState } from '@state/scenario-state';
import { type IGlobalState } from '@state/global-state';
import { TYPES } from '@state/types';
import { RandomQueue, RANDOM_TYPE, typedNames } from '@shared/index';
import {
  IDistrictInfoGenerator,
  IDistrictInfoGeneratorDistrictResult,
  IDistrictInfoGeneratorResult,
} from '../interfaces';
import { typedDistrictTypes } from '../constants';

const { lazyInject } = decorators;

@injectable()
export class DistrictInfoGenerator implements IDistrictInfoGenerator {
  @lazyInject(TYPES.ScenarioState)
  private _scenarioState!: IScenarioState;

  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  private _names!: RandomQueue<string>;

  private _districtTypesList = Object.keys(typedDistrictTypes);

  async generate(): Promise<IDistrictInfoGeneratorResult> {
    return new Promise((resolve) => {
      resolve(this.generateImplementation());
    });
  }

  private generateImplementation(): IDistrictInfoGeneratorResult {
    this.initNames();

    const districts = new Map<number, IDistrictInfoGeneratorDistrictResult>();
    const districtsNum = this._scenarioState.currentValues.map.districts.length;

    for (let i = 0; i < districtsNum; i++) {
      districts.set(i, this.generateDistrict(i));
    }

    return {
      districts,
    };
  }

  private initNames() {
    this._names = new RandomQueue(this._globalState.random);

    typedNames.districts.forEach((name) => {
      this._names.push(name);
    });
  }

  private generateDistrict(districtIndex: number): IDistrictInfoGeneratorDistrictResult {
    const districtData = this._scenarioState.currentValues.map.districts[districtIndex];

    const name = this._names.pop();
    let districtType: string;

    if (districtData.type === RANDOM_TYPE) {
      districtType = this._globalState.random.choice(this._districtTypesList);
    } else {
      districtType = districtData.type;
    }

    const tier = this._globalState.random.randRange(districtData.tier.min, districtData.tier.max + 1);

    return {
      name,
      districtType,
      tier,
    };
  }
}
