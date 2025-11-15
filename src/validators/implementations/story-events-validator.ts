import { injectable } from 'inversify';
import { styleText } from 'node:util';
import { IStoryEvent, typedStoryEvents } from '@state/scenario-state';
import { typedFactions } from '@state/faction-state';
import { STORY_MESSAGES } from '@texts/index';
import { typedContracts, typedSidejobs } from '@state/activity-state';
import { typedCloneTemplates } from '@state/clones-state';
import { IStoryEventsValidator } from '../interfaces';

@injectable()
export class StoryEventsValidator implements IStoryEventsValidator {
  validate(name: string): void {
    console.log(`\tValidating story event ${styleText('cyanBright', name)}`);

    const storyEvent = typedStoryEvents[name];

    this.validateRequiredFaction(name, storyEvent);
    this.validateMessages(name, storyEvent);
    this.validateCloneTemplates(name, storyEvent);
    this.validateSidejobs(name, storyEvent);
    this.validateContracts(name, storyEvent);
  }

  private validateRequiredFaction(name: string, storyEvent: IStoryEvent) {
    const faction = storyEvent.requirements.faction;

    if (!faction) {
      return;
    }

    if (!typedFactions[faction]) {
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

    rewardedCloneTemplates.forEach((cloneTemplate) => {
      if (!typedCloneTemplates[cloneTemplate]) {
        console.log(
          `\t\tStory event ${styleText('cyanBright', name)} has ${styleText('redBright', 'incorrect')} clone template ${cloneTemplate}`,
        );
      }
    });
  }

  private validateSidejobs(name: string, storyEvent: IStoryEvent) {
    const unlockedSidejobs = storyEvent.unlockActivities?.sidejobs;

    if (!unlockedSidejobs) {
      return;
    }

    unlockedSidejobs.forEach((sidejob) => {
      if (!typedSidejobs[sidejob]) {
        console.log(
          `\t\tStory event ${styleText('cyanBright', name)} has ${styleText('redBright', 'incorrect')} sidejob ${sidejob}`,
        );
      }
    });
  }

  private validateContracts(name: string, storyEvent: IStoryEvent) {
    const unlockedContracts = storyEvent.unlockActivities?.contracts;

    if (!unlockedContracts) {
      return;
    }

    unlockedContracts.forEach((contract) => {
      if (!typedContracts[contract]) {
        console.log(
          `\t\tStory event ${styleText('cyanBright', name)} has ${styleText('redBright', 'incorrect')} contract ${contract}`,
        );
      }
    });
  }
}
