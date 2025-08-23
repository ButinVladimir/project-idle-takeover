import { injectable } from 'inversify';
import { IConnectivityState, IConnectivitySerializedState } from '../interfaces';

@injectable()
export class ConnectivityState implements IConnectivityState {
  private _pointsByProgram: number;

  constructor() {
    this._pointsByProgram = 0;
  }

  get pointsByProgram() {
    return this._pointsByProgram;
  }

  increasePointsByProgram(delta: number) {
    this._pointsByProgram += delta;
  }

  async startNewState(): Promise<void> {
    this._pointsByProgram = 0;
  }

  async deserialize(serializedState: IConnectivitySerializedState): Promise<void> {
    this._pointsByProgram = serializedState.pointsByProgram;
  }

  serialize(): IConnectivitySerializedState {
    return {
      pointsByProgram: this._pointsByProgram,
    };
  }
}
