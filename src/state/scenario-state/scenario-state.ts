import { inject, injectable } from 'inversify';
import { Scenario } from '@shared/types';
import constants from '@configs/constants.json';
import scenarios from '@configs/scenarios.json';
import { IScenarioValues, IScenarioState, IScenarioSerializedState, type IStoryEventsState } from './interfaces';
import { TYPES } from '../types';

@injectable()
export class ScenarioState implements IScenarioState {
  @inject(TYPES.StoryEventsState)
  private _storyEventsState!: IStoryEventsState;

  private _scenario!: Scenario;
  private _currentValues!: IScenarioValues;

  constructor() {
    this.currentScenario = constants.startingScenario as Scenario;
  }

  get currentScenario() {
    return this._scenario;
  }

  set currentScenario(value: Scenario) {
    this._scenario = value;
    this._currentValues = this.getScenarioValues(value);
  }

  get currentValues() {
    return this._currentValues;
  }

  get storyEvents() {
    return this._storyEventsState;
  }

  getScenarioValues(scenario: Scenario): IScenarioValues {
    return scenarios[scenario] as IScenarioValues;
  }

  async startNewState(): Promise<void> {
    this.currentScenario = constants.startingScenario as Scenario;
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
