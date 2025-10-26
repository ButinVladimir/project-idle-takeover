import { injectable } from 'inversify';
import { styleText } from 'node:util';
import storyEvents from '@configs/story-events.json';
import factions from '@configs/factions.json';
import cloneTemplates from '@configs/clone-templates.json';
import sidejobs from '@configs/sidejobs.json';
import { IStoryEvent } from '@state/scenario-state';
import { IFactionValues } from '@state/faction-state';
import { Faction } from '@shared/index';
import { STORY_MESSAGES } from '@texts/index';
import { ICloneTemplate, ISidejobTemplate } from '@state/company-state';
import { IStoryEventsValidator } from '../interfaces';

@injectable()
export class StoryEventsValidator implements IStoryEventsValidator {
  validate(name: string): void {
    console.log(`\tValidating story event ${styleText('cyanBright', name)}`);

    const storyEvent = this.getStoryEvent(name);

    this.validateRequiredFaction(name, storyEvent);
    this.validateMessages(name, storyEvent);
    this.validateCloneTemplates(name, storyEvent);
    this.validateSidejobs(name, storyEvent);
  }

  private validateRequiredFaction(name: string, storyEvent: IStoryEvent) {
    const faction = storyEvent.requirements.faction;

    if (!faction) {
      return;
    }

    const convertedFactions = factions as any as Record<Faction, IFactionValues>;

    if (!convertedFactions[faction]) {
      console.log(
        `\t\tStory event ${styleText('cyanBright', name)} has ${styleText('redBright', 'incorrect')} required faction ${faction}`,
      );
    }
  }

  private validateMessages(name: string, storyEvent: IStoryEvent) {
    const messages = storyEvent.messages;

    if (!messages) {
      return;
    }

    messages.forEach((message) => {
      if (!STORY_MESSAGES[message]) {
        console.log(
          `\t\tStory event ${styleText('cyanBright', name)} has ${styleText('redBright', 'incorrect')} message ${message}`,
        );
      }
    });
  }

  private validateCloneTemplates(name: string, storyEvent: IStoryEvent) {
    const rewardedCloneTemplates = storyEvent.rewardDesigns?.cloneTemplates;

    if (!rewardedCloneTemplates) {
      return;
    }

    const convertedCloneTemplates = cloneTemplates as any as Record<Faction, ICloneTemplate>;

    rewardedCloneTemplates.forEach((cloneTemplate) => {
      if (!convertedCloneTemplates[cloneTemplate]) {
        console.log(
          `\t\tStory event ${styleText('cyanBright', name)} has ${styleText('redBright', 'incorrect')} clone template ${cloneTemplate}`,
        );
      }
    });
  }

  private validateSidejobs(name: string, storyEvent: IStoryEvent) {
    const unlockedSidejobs = storyEvent.unlockSidejobs;

    if (!unlockedSidejobs) {
      return;
    }

    const convertedSidejobs = sidejobs as any as Record<Faction, ISidejobTemplate>;

    unlockedSidejobs.forEach((sidejob) => {
      if (!convertedSidejobs[sidejob]) {
        console.log(
          `\t\tStory event ${styleText('cyanBright', name)} has ${styleText('redBright', 'incorrect')} sidejob ${sidejob}`,
        );
      }
    });
  }

  private getStoryEvent(name: string): IStoryEvent {
    return (storyEvents as any as Record<string, IStoryEvent>)[name];
  }
}
