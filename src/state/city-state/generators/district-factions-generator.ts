import { injectable } from 'inversify';
import { decorators } from '@state/container';
import districtTypes from '@configs/district-types.json';
import { type IScenarioState } from '@state/scenario-state';
import { type IGlobalState } from '@state/global-state';
import { TYPES } from '@state/types';
import { RandomQueue, calculatePower } from '@shared/index';
import {
  IDistrictTypeTemplate,
  IDistrictFactionsGenerator,
  IDistrictFactionsGeneratorResult,
  IDistrictInfoGeneratorResult,
  type ICityState,
} from '../interfaces';

const { lazyInject } = decorators;

@injectable()
export class DistrictFactionsGenerator implements IDistrictFactionsGenerator {
  @lazyInject(TYPES.ScenarioState)
  private _scenarioState!: IScenarioState;

  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  @lazyInject(TYPES.CityState)
  private _cityState!: ICityState;

  private _districtFactionIndexes!: Map<number, number>;
  private _controlledAreaMap!: Map<number, number>;
  private _districtQueues!: Map<number, RandomQueue<number>>;
  private _districtInfos!: IDistrictInfoGeneratorResult;

  async generate(districtInfos: IDistrictInfoGeneratorResult): Promise<IDistrictFactionsGeneratorResult> {
    this._districtInfos = districtInfos;

    return new Promise((resolve) => {
      resolve(this.generateImplementation());
    });
  }

  private generateImplementation(): IDistrictFactionsGeneratorResult {
    this.initCollections();
    this.initData();
    this.expandFactions();
    this.markRemainingDistrictsAsStarting();

    return {
      districts: this._districtFactionIndexes,
    };
  }

  private initCollections() {
    this._districtFactionIndexes = new Map<number, number>();
    this._controlledAreaMap = new Map<number, number>();
    this._districtQueues = new Map<number, RandomQueue<number>>();
  }

  private initData() {
    const factions = this._scenarioState.currentValues.map.factions;

    for (let index = 0; index < factions.length; index++) {
      const factionData = factions[index];
      const startingDistrict = factionData.startingDistrict;

      const districtInfo = this._districtInfos.districts.get(startingDistrict)!;
      const startingDistrictType = districtInfo.districtType;
      const districtTypeData = districtTypes[startingDistrictType] as IDistrictTypeTemplate;

      const startingDistrictDifficulty =
        this._cityState.getDistrictSize(startingDistrict) *
        calculatePower(districtInfo.tier, districtTypeData.captureDifficulty);

      const districtQueue = new RandomQueue<number>(this._globalState.random);

      this.pushConnectedNeigbours(startingDistrict, districtQueue);

      this._districtFactionIndexes.set(startingDistrict, index);
      this._controlledAreaMap.set(index, factionData.controlledArea - startingDistrictDifficulty);
      this._districtQueues.set(index, districtQueue);
    }
  }

  private pushConnectedNeigbours(district: number, districtQueue: RandomQueue<number>) {
    for (const connectedDistrict of this._cityState.getDistrictConnections(district).values()) {
      districtQueue.push(connectedDistrict);
    }
  }

  private expandFactions() {
    const factions = this._scenarioState.currentValues.map.factions;

    let expanded = true;

    while (expanded) {
      expanded = false;

      for (let index = 0; index < factions.length; index++) {
        const districtQueue = this._districtQueues.get(index)!;

        while (!districtQueue.isEmpty()) {
          const nextDistrict = districtQueue.pop();

          const districtInfo = this._districtInfos.districts.get(nextDistrict)!;
          const districtType = districtInfo.districtType;
          const districtTypeData = districtTypes[districtType] as IDistrictTypeTemplate;

          const factionControlledArea = this._controlledAreaMap.get(index)!;
          const districtDifficulty =
            this._cityState.getDistrictSize(nextDistrict) *
            calculatePower(districtInfo.tier, districtTypeData.captureDifficulty);

          if (!this._districtFactionIndexes.has(nextDistrict) && factionControlledArea >= districtDifficulty) {
            this._controlledAreaMap.set(index, factionControlledArea - districtDifficulty);
            this._districtFactionIndexes.set(nextDistrict, index);
            this.pushConnectedNeigbours(nextDistrict, districtQueue);

            expanded = true;
            break;
          }
        }
      }
    }
  }

  private markRemainingDistrictsAsStarting() {
    const districtsNum = this._scenarioState.currentValues.map.districts.length;

    for (let i = 0; i < districtsNum; i++) {
      if (!this._districtFactionIndexes.has(i)) {
        this._districtFactionIndexes.set(i, this._scenarioState.currentValues.map.startingFactionIndex);
      }
    }
  }
}
