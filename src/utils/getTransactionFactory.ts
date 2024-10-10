import {
  AbiRegistry,
  SmartContractTransactionsFactory,
  TransactionsFactoryConfig
} from '@multiversx/sdk-core/out';
import { chainIdByEnvironment } from '@multiversx/sdk-dapp/constants';
import { environment } from 'config';

export function getTransactionFactory(abi?: AbiRegistry) {
  return new SmartContractTransactionsFactory({
    config: new TransactionsFactoryConfig({
      chainID: chainIdByEnvironment[environment]
    }),
    abi: abi
  });
}
