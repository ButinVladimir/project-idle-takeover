import { injectable } from 'inversify';
import { styleText } from 'node:util';
import scenarios from '@configs/scenarios.json';
import districtTypes from '@configs/district-types.json';
import factions from '@configs/factions.json';
import storyEvents from '@configs/story-events.json';
import { IScenarioValues, IStoryEvent } from '@state/scenario-state';
import { IFactionValues } from '@state/faction-state';
import { RANDOM_TYPE } from '@shared/index';
import { IDistrictTypeTemplate } from '@state/city-state';
import { IScenariosValidator } from '../interfaces';

@injectable()
export class ScenariosValidator implements IScenariosValidator {
  validate(name: string): void {
    console.log(`\tValidating scenario ${styleText('cyanBright', name)}`);

    const scenario = this.getScenario(name);

    this.validateMap(name, scenario);
    this.validateStoryEvents(name, scenario);
  }

  private validateMap(name: string, scenario: IScenarioValues) {
    this.validateMapDistrictTiers(name, scenario);
    this.validateMapDistrictTypes(name, scenario);
    this.validateMapFactionsDistrict(name, scenario);
    this.validateMapFactionNames(name, scenario);
    this.validateMapNeutralFactionIndex(name, scenario);
    this.validateMapStartingDistrict(name, scenario);
  }

  private validateMapDistrictTiers(name: string, scenario: IScenarioValues) {
    const districts = scenario.map.districts;

    districts.forEach((district, index) => {
      if (district.tier.min > district.tier.max) {
        console.log(
          `\t\tScenario ${styleText('cyanBright', name)} has ${styleText('redBright', 'incorrect')} tier range for district ${index}`,
        );
      }
    });
  }

  private validateMapDistrictTypes(name: string, scenario: IScenarioValues) {
    const districts = scenario.map.districts;

    const convertedDistrictTypes = districtTypes as any as Record<string, IDistrictTypeTemplate>;

    districts.forEach((district, index) => {
      if (district.type !== RANDOM_TYPE && !convertedDistrictTypes[district.type]) {
        console.log(
          `\t\tScenario ${styleText('cyanBright', name)} has ${styleText('redBright', 'incorrect')} district type for district ${index}`,
        );
      }
    });
  }

  private validateMapFactionsDistrict(name: string, scenario: IScenarioValues) {
    const startingFactions = scenario.map.factions;
    const districts = scenario.map.districts;

    startingFactions.forEach((faction, index) => {
      if (faction.startingDistrict >= districts.length) {
        console.log(
          `\t\tScenario ${styleText('cyanBright', name)} has ${styleText('redBright', 'incorrect')} district index for starting faction ${index}`,
        );
      }
    });
  }

  private validateMapFactionNames(name: string, scenario: IScenarioValues) {
    const startingFactions = scenario.map.factions;

    const convertedFactions = factions as any as Record<string, IFactionValues>;

    startingFactions.forEach((faction, index) => {
      if (faction.name !== RANDOM_TYPE && !convertedFactions[faction.name]) {
        console.log(
          `\t\tScenario ${styleText('cyanBright', name)} has ${styleText('redBright', 'incorrect')} faction name ${faction.name} for starting faction ${index}`,
        );
      }
    });
  }

  private validateMapNeutralFactionIndex(name: string, scenario: IScenarioValues) {
    const startingFactions = scenario.map.factions;

    if (scenario.map.neutralFactionIndex >= startingFactions.length) {
      console.log(
        `\t\tScenario ${styleText('cyanBright', name)} has ${styleText('redBright', 'incorrect')} neutral faction index ${scenario.map.neutralFactionIndex}`,
      );
    }
  }

  private validateMapStartingDistrict(name: string, scenario: IScenarioValues) {
    const districts = scenario.map.districts;

    if (scenario.map.startingDistrict >= districts.length) {
      console.log(
        `\t\tScenario ${styleText('cyanBright', name)} has ${styleText('redBright', 'incorrect')} starting district index ${scenario.map.neutralFactionIndex}`,
      );
    }
  }

  private validateStoryEvents(name: string, scenario: IScenarioValues) {
    const scenarioStoryEvents = scenario.storyEvents;

    const convertedStoryEvents = storyEvents as any as Record<string, IStoryEvent>;

    scenarioStoryEvents.forEach((storyEvent) => {
      if (!convertedStoryEvents[storyEvent]) {
        console.log(
          `\t\tScenario ${styleText('cyanBright', name)} has ${styleText('redBright', 'incorrect')} story event ${storyEvent}`,
        );
      }
    });
  }

  private getScenario(name: string): IScenarioValues {
    return (scenarios as any as Record<string, IScenarioValues>)[name];
  }
}
