import storyEvents from '@configs/story-events.json';
import scenarios from '@configs/scenarios.json';
import { typeConfigEntries } from '@shared/index';
import { IScenarioValues, IStoryEvent } from './interfaces';

export const typedStoryEvents = typeConfigEntries<IStoryEvent>(storyEvents);

export const typedScenarios = typeConfigEntries<IScenarioValues>(scenarios);
