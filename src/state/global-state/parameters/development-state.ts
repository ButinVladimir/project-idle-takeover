import { injectable } from 'inversify';
import { msg, str } from '@lit/localize';
import { decorators } from '@state/container';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { type IMessageLogState } from '@state/message-log-state';
import { type IScenarioState } from '@state/scenario-state';
import { TYPES } from '@state/types';
import {
  calculateGeometricProgressionSum,
  reverseGeometricProgressionSum,
  type IFormatter,
  GameStateEvent,
  IncomeSource,
} from '@shared/index';
import { IDevelopmentState, IDevelopmentSerializedState } from '../interfaces';

const { lazyInject } = decorators;

@injectable()
export class DevelopmentState implements IDevelopmentState {
  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  @lazyInject(TYPES.ScenarioState)
  private _scenarioState!: IScenarioState;

  @lazyInject(TYPES.MessageLogState)
  private _messageLogState!: IMessageLogState;

  @lazyInject(TYPES.Formatter)
  private _formatter!: IFormatter;

  private _points: number;
  private _level: number;
  private _income: Map<IncomeSource, number>;

  constructor() {
    this._points = 0;
    this._level = 0;
    this._income = new Map<IncomeSource, number>();

    this._stateUiConnector.registerEventEmitter(this, ['_level']);
  }

  get points() {
    return this._points;
  }

  get level() {
    return this._level;
  }

  increase(pointsDelta: number, incomeSource: IncomeSource): void {
    this._points += pointsDelta;
    const prevIncome = this.getIncome(incomeSource);
    this._income.set(incomeSource, prevIncome + pointsDelta);
  }

  getIncome(incomeSource: IncomeSource): number {
    return this._income.get(incomeSource) ?? 0;
  }

  getLevelRequirements(level: number): number {
    if (level < 0) {
      return 0;
    }

    const { base, multiplier } = this._scenarioState.currentValues.developmentLevelRequirements;

    return calculateGeometricProgressionSum(level, multiplier, base);
  }

  recalculateLevel() {
    const prevLevel = this._level;
    const newLevel = this.calculateLevelFromPoints();

    if (newLevel > prevLevel) {
      this._level = newLevel;
      const formattedLevel = this._formatter.formatLevel(this._level);

      this._messageLogState.postMessage(
        GameStateEvent.levelReached,
        msg(str`Development level ${formattedLevel} has been reached`),
      );
      this._scenarioState.storyEvents.visitEvents();
    }
  }

  async startNewState(): Promise<void> {
    this._level = this._scenarioState.currentValues.startingDevelopmentLevel;
    this._points = this.getLevelRequirements(this._level - 1);
    this._income.clear();
  }

  async deserialize(serializedState: IDevelopmentSerializedState): Promise<void> {
    this._points = serializedState.points;
    this._level = this.calculateLevelFromPoints();

    this._income.clear();
    Object.entries(serializedState.income).forEach(([incomeSource, value]) => {
      this._income.set(incomeSource as IncomeSource, value);
    });
  }

  serialize(): IDevelopmentSerializedState {
    return {
      points: this._points,
      income: Object.fromEntries(this._income.entries()) as Record<IncomeSource, number>,
    };
  }

  private calculateLevelFromPoints(): number {
    const { base, multiplier } = this._scenarioState.currentValues.developmentLevelRequirements;

    return reverseGeometricProgressionSum(this._points, multiplier, base);
  }
}
