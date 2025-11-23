import { inject, injectable } from 'inversify';
import { typedConstants } from '@shared/index';
import { IScenarioValues, IScenarioState, IScenarioSerializedState, type IStoryEventsState } from './interfaces';
import { TYPES } from '../types';
import { typedScenarios } from './constants';

@injectable()
export class ScenarioState implements IScenarioState {
  @inject(TYPES.StoryEventsState)
  private _storyEventsState!: IStoryEventsState;

  private _scenario!: string;

  constructor() {
    this.currentScenario = typedConstants.startingValues.scenario;
  }

  get currentScenario() {
    return this._scenario;
  }

  set currentScenario(value: string) {
    this._scenario = value;
  }

  get currentValues() {
    return this.getScenarioValues(this._scenario);
  }

  get storyEvents() {
    return this._storyEventsState;
  }

  getScenarioValues(scenario: string): IScenarioValues {
    return typedScenarios[scenario];
  }

  async startNewState(): Promise<void> {
    this.currentScenario = typedConstants.startingValues.scenario;

    await this._storyEventsState.startNewState();
  }

  async deserialize(serializedState: IScenarioSerializedState): Promise<void> {
    this.currentScenario = serializedState.currentScenario;
    await this._storyEventsState.deserialize(serializedState.storyEvents);
  }

  serialize(): IScenarioSerializedState {
    return {
      currentScenario: this._scenario,
      storyEvents: this._storyEventsState.serialize(),
    };
  }
}
