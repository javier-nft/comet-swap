import {
  faArrowsUpDown,
  faMeteor,
  faWallet
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  BigUIntValue,
  BytesValue,
  TokenIdentifierValue,
  TokenTransfer
} from '@multiversx/sdk-core/out';
import { NonFungibleTokenOfAccountOnNetwork } from '@multiversx/sdk-network-providers/out';
import BigNumber from 'bignumber.js';
import { AmountSelector, Button, FormatAmount } from 'components';
import { TOKENS, dexAggregatorScAddress, nativeChainCoin } from 'config';
import {
  DexAggregatorSwapEvaluationOut,
  estimateAmountOut,
  fetchAllTokensBalances,
  sendTransactions
} from 'helpers';
import { useGetAccount, useGetIsLoggedIn } from 'hooks';
import { useEffect, useState } from 'react';
import { Token } from 'types';
import { useDebouncedCallback } from 'use-debounce';
import { Address, getTransactionFactory } from 'utils';
import { TokenSelector } from '../../components/TokenSelector/TokenSelector';

export const SwapTool = () => {
  const [balances, setBalances] =
    useState<NonFungibleTokenOfAccountOnNetwork[]>();
  const [selectedInputToken, setSelectedInputToken] = useState(TOKENS[0]);
  const [tokenAmountIn, setTokenAmountIn] = useState<BigNumber>();
  const [selectedOutputToken, setSelectedOutputToken] = useState(TOKENS[1]);
  const [selectedEvaluation, setSelectedEvaluation] = useState<
    'static' | 'dynamic'
  >('static');
  const [swapEstimation, setSwapEstimation] =
    useState<DexAggregatorSwapEvaluationOut | null>();
  const [isFetchingEvaluation, setIsFetchingEvaluation] = useState(false);

  const { address } = useGetAccount();

  const isLoggedIn = useGetIsLoggedIn();

  useEffect(() => {
    fetchAllTokensBalances({ address }).then(setBalances);

    const interval = setInterval(
      () => fetchAllTokensBalances({ address }).then(setBalances),
      20_000
    );

    return () => clearInterval(interval);
  }, [address]);

  const onChangeTokenAmountIn = useDebouncedCallback(() => {
    setSwapEstimation(undefined);

    doFetchSwapEvaluation();
  }, 500);

  useEffect(() => {
    onChangeTokenAmountIn();
  }, [tokenAmountIn]);

  useEffect(() => {
    setTokenAmountIn(undefined);
    setSwapEstimation(undefined);
  }, [selectedInputToken]);

  useEffect(() => {
    setTokenAmountIn(undefined);
    setSwapEstimation(undefined);

    doFetchSwapEvaluation();
  }, [selectedOutputToken]);

  async function onChangeTokenIn(newValue: Token) {
    setTokenAmountIn(undefined);

    setSelectedInputToken(newValue);
  }

  async function onChangeTokenOut(newValue: Token) {
    setSelectedOutputToken(newValue);
  }

  async function doFetchSwapEvaluation() {
    if (tokenAmountIn) {
      setIsFetchingEvaluation(true);

      try {
        const estimation = await estimateAmountOut(
          selectedInputToken.id,
          tokenAmountIn,
          selectedOutputToken.id
        );

        setSwapEstimation(estimation);
      } finally {
        setIsFetchingEvaluation(false);
      }
    } else {
      setSwapEstimation(undefined);
    }
  }

  async function onSwap() {
    if (!swapEstimation) return;
    if (!evaluation) return;
    if (!tokenAmountIn) return;

    const tokenTransfers =
      selectedInputToken.id === nativeChainCoin
        ? undefined
        : [
            TokenTransfer.fungibleFromBigInteger(
              selectedInputToken.id,
              tokenAmountIn
            )
          ];

    const nativeTransferAmount =
      selectedInputToken.id === nativeChainCoin
        ? BigInt(tokenAmountIn.toFixed())
        : undefined;

    const amounts_and_routes_payload_args =
      evaluation.amounts_and_routes_payload
        .split('@')
        .map((x) => new BytesValue(Buffer.from(x, 'hex')));

    const args: any[] = [
      new TokenIdentifierValue(selectedOutputToken.id),
      new BigUIntValue(
        new BigNumber(evaluation.net_amount_out)
          .multipliedBy(9_975)
          .dividedToIntegerBy(10_000)
      )
    ];

    args.push(...amounts_and_routes_payload_args);

    const tx = getTransactionFactory().createTransactionForExecute({
      sender: new Address(address),
      contract: new Address(dexAggregatorScAddress),
      function: 'aggregate',
      arguments: args,
      gasLimit: BigInt(evaluation.estimated_gas),
      tokenTransfers,
      nativeTransferAmount
    });

    console.log('value', tx.value.toString());
    console.log('tx', tx.data.toString());

    await sendTransactions({
      transactions: [tx]
    });
  }

  async function onSwitchTokens() {
    setSelectedInputToken(selectedOutputToken);
    setSelectedOutputToken(selectedInputToken);
  }

  const evaluation =
    selectedEvaluation === 'dynamic' && swapEstimation?.dynamic
      ? swapEstimation?.dynamic
      : swapEstimation?.static;

  const netAmountOut = evaluation
    ? new BigNumber(evaluation.net_amount_out)
    : undefined;

  const tokenInBalance =
    balances?.find((x) => x.identifier === selectedInputToken.id)?.balance ||
    new BigNumber(0);

  const tokenOutBalance =
    balances?.find((x) => x.identifier === selectedOutputToken.id)?.balance ||
    new BigNumber(0);

  const maxAmountIn = address
    ? tokenInBalance
    : new BigNumber(Number.MAX_VALUE);

  return (
    <div className='flex flex-col gap-5 items-center bg-emerald-900/25 rounded rounded-xl px-5 py-5 m-auto border border-emerald-900/50 border-2 w-fit shadow shadow-lg shadow-black'>
      <div className='flex flex-col items-center text-white'>
        <div>Swap tokens at the best rate</div>
        <div>using opendex-aggregator</div>
      </div>

      <div className='flex flex-col-reverse md:flex-row gap-2 items-center self-stretch justify-end'>
        <AmountSelector
          denomination={selectedInputToken.decimals}
          invalid={false}
          max={maxAmountIn}
          onChange={setTokenAmountIn}
          value={tokenAmountIn}
        />

        <TokenSelector
          tokens={TOKENS}
          value={selectedInputToken}
          onChange={onChangeTokenIn}
        />
      </div>

      {address && (
        <div className='flex items-center self-stretch justify-end gap-2 text-gray-500'>
          <FontAwesomeIcon icon={faWallet} />
          <FormatAmount
            value={tokenInBalance.toFixed(0)}
            decimals={selectedInputToken?.decimals}
            showLabel={false}
          />
        </div>
      )}

      <div className='py-2'>
        <Button
          className='px-4 rounded-full'
          color='emerald'
          onClick={() => onSwitchTokens()}
        >
          <FontAwesomeIcon icon={faArrowsUpDown} />
        </Button>
      </div>

      <div className='flex flex-col-reverse md:flex-row gap-2 items-center self-stretch justify-end'>
        <AmountSelector
          denomination={selectedOutputToken.decimals}
          disabled
          invalid={false}
          max={new BigNumber(Number.MAX_VALUE)}
          showMaxButton={false}
          value={netAmountOut}
        />

        <TokenSelector
          tokens={TOKENS}
          value={selectedOutputToken}
          onChange={onChangeTokenOut}
        />
      </div>

      {address && (
        <div className='flex items-center self-stretch justify-end gap-2 text-gray-500'>
          <FontAwesomeIcon icon={faWallet} />
          <FormatAmount
            value={tokenOutBalance.toFixed(0)}
            decimals={selectedOutputToken?.decimals}
            showLabel={false}
          />
        </div>
      )}

      {swapEstimation && (
        <div className='flex gap-2 items-center text-gray-200'>
          <div
            className={`flex flex-col gap-2 border border-2 border-gray-500/50 rounded rounded-lg p-2 cursor-pointer
            ${
              evaluation === swapEstimation.static ? 'border-emerald-500' : ''
            }`}
            onClick={() => setSelectedEvaluation('static')}
          >
            <span>Static</span>
            <div>{swapEstimation.static?.net_human_amount_out || '-'}</div>
            {swapEstimation.static && (
              <div>
                Tx fee:{' '}
                <FormatAmount
                  value={swapEstimation.static.estimated_tx_fee_egld}
                  showLabel={false}
                />{' '}
                {nativeChainCoin}
              </div>
            )}
          </div>

          <div
            className={`flex flex-col gap-2 border border-2 border-gray-500/50 rounded rounded-lg p-2 cursor-pointer
            ${
              evaluation === swapEstimation.dynamic ? 'border-emerald-500' : ''
            }`}
            onClick={() => setSelectedEvaluation('dynamic')}
          >
            <span>Dynamic</span>
            <div>{swapEstimation.dynamic?.net_human_amount_out || '-'}</div>
            {swapEstimation.dynamic && (
              <div>
                Tx fee:{' '}
                <FormatAmount
                  value={swapEstimation.dynamic.estimated_tx_fee_egld}
                  showLabel={false}
                />{' '}
                {nativeChainCoin}
              </div>
            )}
          </div>
        </div>
      )}

      <Button color='emerald' disabled={!isLoggedIn} onClick={onSwap}>
        <FontAwesomeIcon icon={faMeteor} /> Swap
      </Button>
    </div>
  );
};
