import { XORShift128Plus } from 'random-seedable';
import { injectable, inject } from 'inversify';
import { v4 as uuid } from 'uuid';
import { TYPES } from '@state/types';
import { decorators } from '@state/container';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { IGlobalSerializedState, IGlobalState } from './interfaces';
import type {
  ITimeState,
  IDevelopmentState,
  IMoneyState,
  IMultipliersState,
  IConnectivityState,
  IThreatState,
  ISynchronizationState,
  IExperienceShareState,
  IProcessCompletionSpeedState,
  IRewardsState,
} from './interfaces';
import { GameSpeed } from './types';

const { lazyInject } = decorators;

@injectable()
export class GlobalState implements IGlobalState {
  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

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

  @inject(TYPES.ExperienceShareState)
  private _experienceShare!: IExperienceShareState;

  @inject(TYPES.ProcessCompletionSpeedState)
  private _processCompletionSpeed!: IProcessCompletionSpeedState;

  @inject(TYPES.RewardsState)
  private _rewardsState!: IRewardsState;

  private _random: XORShift128Plus;
  private _gameSpeed: GameSpeed;
  private _runId: string;

  constructor() {
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

  get experienceShare(): IExperienceShareState {
    return this._experienceShare;
  }

  get processCompletionSpeed(): IProcessCompletionSpeedState {
    return this._processCompletionSpeed;
  }

  get rewards(): IRewardsState {
    return this._rewardsState;
  }

  recalculate() {
    this._developmentState.recalculateLevel();
    this._multipliersState.recalculate();
    this._synchronization.recalculate();
    this._experienceShare.recalculate();
    this._processCompletionSpeed.recalculate();
    this._rewardsState.recalculateMultiplier();
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

    await this._moneyState.startNewState();
    await this._timeState.startNewState();
    await this._developmentState.startNewState();
    await this._connectivity.startNewState();
    await this._multipliersState.startNewState();
    await this._rewardsState.startNewState();

    this._synchronization.requestRecalculation();
  }

  async deserialize(serializedState: IGlobalSerializedState): Promise<void> {
    this._random.seed = BigInt(serializedState.randomSeed);
    this._random.y = BigInt(serializedState.randomShift);

    this._runId = serializedState.runId;
    this._gameSpeed = serializedState.gameSpeed;

    await this._moneyState.deserialize(serializedState.money);
    await this._timeState.deserialize(serializedState.time);
    await this._developmentState.deserialize(serializedState.development);
    await this._connectivity.deserialize(serializedState.connectivity);
    await this._multipliersState.deserialize(serializedState.multipliers);
    await this._rewardsState.deserialize(serializedState.rewards);

    this._synchronization.requestRecalculation();
  }

  serialize(): IGlobalSerializedState {
    return {
      randomSeed: this._random.seed.toString(),
      randomShift: this._random.y.toString(),
      runId: this._runId,
      gameSpeed: this.gameSpeed,
      money: this._moneyState.serialize(),
      time: this._timeState.serialize(),
      development: this._developmentState.serialize(),
      connectivity: this._connectivity.serialize(),
      multipliers: this._multipliersState.serialize(),
      rewards: this._rewardsState.serialize(),
    };
  }
}
