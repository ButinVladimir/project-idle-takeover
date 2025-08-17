import { XORShift128Plus } from 'random-seedable';
import { injectable, inject } from 'inversify';
import { v4 as uuid } from 'uuid';
import { TYPES } from '@state/types';
import { decorators } from '@state/container';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { IGlobalSerializedState, IGlobalState } from './interfaces';
import type {
  ITimeState,
  IScenarioState,
  IStoryEventsState,
  IDevelopmentState,
  IMoneyState,
  IUnlockedFeaturesState,
  IMultipliersState,
  IFactionState,
  IAvailableItemsState,
  IConnectivityState,
  IThreatState,
  ISynchronizationState,
  IAvailableActivities,
  IExperienceShareState,
  IProcessCompletionSpeedState,
} from './interfaces';
import { GameSpeed } from './types';
import { AvailableActivities } from './parameters/available-activities-state';

const { lazyInject } = decorators;

@injectable()
export class GlobalState implements IGlobalState {
  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  @inject(TYPES.ScenarioState)
  private _scenarioState!: IScenarioState;

  @inject(TYPES.FactionState)
  private _factionState!: IFactionState;

  @inject(TYPES.TimeState)
  private _timeState!: ITimeState;

  @inject(TYPES.DevelopmentState)
  private _developmentState!: IDevelopmentState;

  @inject(TYPES.MoneyState)
  private _moneyState!: IMoneyState;

  @inject(TYPES.ConnectivityState)
  private _connectivity!: IConnectivityState;

  @inject(TYPES.ThreatState)
  private _threat!: IThreatState;

  @inject(TYPES.SynchronizationState)
  private _synchronization!: ISynchronizationState;

  @inject(TYPES.MultipliersState)
  private _multipliersState!: IMultipliersState;

  private _availableActivities: IAvailableActivities;

  @inject(TYPES.AvailableItemsState)
  private _availableItemsState!: IAvailableItemsState;

  @inject(TYPES.UnlockedFeaturesState)
  private _unlockedFeaturesState!: IUnlockedFeaturesState;

  @inject(TYPES.StoryEventsState)
  private _storyEventsState!: IStoryEventsState;

  @inject(TYPES.ExperienceShareState)
  private _experienceShare!: IExperienceShareState;

  @inject(TYPES.ProcessCompletionSpeedState)
  private _processCompletionSpeed!: IProcessCompletionSpeedState;

  private _random: XORShift128Plus;
  private _gameSpeed: GameSpeed;
  private _runId: string;

  constructor() {
    this._availableActivities = new AvailableActivities();

    this._random = new XORShift128Plus(0, 0n);
    this._gameSpeed = GameSpeed.normal;
    this._runId = uuid();

    this._stateUiConnector.registerEventEmitter(this, ['_gameSpeed']);
  }

  get random() {
    return this._random;
  }

  get runId() {
    return this._runId;
  }

  get scenario() {
    return this._scenarioState;
  }

  get faction() {
    return this._factionState;
  }

  get gameSpeed() {
    return this._gameSpeed;
  }

  set gameSpeed(value: GameSpeed) {
    this._gameSpeed = value;
  }

  get money(): IMoneyState {
    return this._moneyState;
  }

  get time(): ITimeState {
    return this._timeState;
  }

  get development(): IDevelopmentState {
    return this._developmentState;
  }

  get connectivity(): IConnectivityState {
    return this._connectivity;
  }

  get threat(): IThreatState {
    return this._threat;
  }

  get synchronization(): ISynchronizationState {
    return this._synchronization;
  }

  get multipliers(): IMultipliersState {
    return this._multipliersState;
  }

  get availableItems(): IAvailableItemsState {
    return this._availableItemsState;
  }

  get availableActivities(): IAvailableActivities {
    return this._availableActivities;
  }

  get unlockedFeatures(): IUnlockedFeaturesState {
    return this._unlockedFeaturesState;
  }

  get storyEvents(): IStoryEventsState {
    return this._storyEventsState;
  }

  get experienceShare(): IExperienceShareState {
    return this._experienceShare;
  }

  get processCompletionSpeed(): IProcessCompletionSpeedState {
    return this._processCompletionSpeed;
  }

  recalculate() {
    this._developmentState.recalculateLevel();
    this._multipliersState.recalculate();
    this._synchronization.recalculate();
    this._availableItemsState.recalculate();
    this._availableActivities.recalculate();
    this._experienceShare.recalculate();
    this._processCompletionSpeed.recalculate();
  }

  makeNextTick() {
    this.time.makeNextTick();
  }

  async startNewState(): Promise<void> {
    const startingSeed = Date.now();
    this._random.seed = BigInt(startingSeed);
    this._random.y = BigInt(startingSeed);

    this._runId = uuid();
    this._gameSpeed = GameSpeed.normal;

    await this._scenarioState.startNewState();
    await this._factionState.startNewState();
    await this._moneyState.startNewState();
    await this._timeState.startNewState();
    await this._developmentState.startNewState();
    await this._connectivity.startNewState();
    await this._multipliersState.startNewState();
    await this._availableItemsState.startNewState();
    await this._unlockedFeaturesState.startNewState();
    this.storyEvents.startNewState();

    this._synchronization.requestRecalculation();
    this._experienceShare.requestRecalculation();
    this._processCompletionSpeed.requestRecalculation();
  }

  async deserialize(serializedState: IGlobalSerializedState): Promise<void> {
    this._random.seed = BigInt(serializedState.randomSeed);
    this._random.y = BigInt(serializedState.randomShift);

    this._runId = serializedState.runId;
    this._gameSpeed = serializedState.gameSpeed;

    await this._scenarioState.deserialize(serializedState.scenario);
    await this._factionState.deserialize(serializedState.faction);
    await this._moneyState.deserialize(serializedState.money);
    await this._timeState.deserialize(serializedState.time);
    await this._developmentState.deserialize(serializedState.development);
    await this._connectivity.deserialize(serializedState.connectivity);
    await this._multipliersState.deserialize(serializedState.multipliers);
    await this._availableItemsState.deserialize(serializedState.availableItems);
    await this._unlockedFeaturesState.deserialize(serializedState.unlockedFeatures);

    this._synchronization.requestRecalculation();
    this._experienceShare.requestRecalculation();
    this._processCompletionSpeed.requestRecalculation();
  }

  serialize(): IGlobalSerializedState {
    return {
      randomSeed: this._random.seed.toString(),
      randomShift: this._random.y.toString(),
      runId: this._runId,
      gameSpeed: this.gameSpeed,
      scenario: this._scenarioState.serialize(),
      faction: this._factionState.serialize(),
      money: this._moneyState.serialize(),
      time: this._timeState.serialize(),
      development: this._developmentState.serialize(),
      connectivity: this._connectivity.serialize(),
      multipliers: this._multipliersState.serialize(),
      availableItems: this._availableItemsState.serialize(),
      unlockedFeatures: this._unlockedFeaturesState.serialize(),
    };
  }
}
