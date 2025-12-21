import { ISerializedContract } from './serialized-contract';
import { IContract } from './contract';

export interface IContractsFactory {
  makeContract(contractArgs: ISerializedContract): IContract;
}
