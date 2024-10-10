import BigNumber from 'bignumber.js';
import { Button } from 'components/Button';
import { useEffect, useState } from 'react';
import { NumberFormatValues, NumericFormat } from 'react-number-format';

export interface AmountSelectorPropsType {
  disabled?: boolean;
  invalid: boolean;
  max: BigNumber;
  min?: BigNumber;
  onChange?: (amount: BigNumber | undefined) => any;
  denomination: number;
  value?: BigNumber;
  showMaxButton?: boolean;
}

export const AmountSelector = ({
  disabled = false,
  invalid = false,
  max,
  min,
  onChange,
  denomination,
  value,
  showMaxButton = true
}: AmountSelectorPropsType) => {
  // internal value = raw string
  const [internalValue, setInternalValue] = useState(value?.toString() || '');

  useEffect(() => {
    // console.log('AmountSelector::value changed');

    if (value === undefined) {
      setInternalValue('');
      return;
    }

    // console.log(internalValueToValue(internalValue).toFixed(), value.toFixed());

    if (!internalValueToValue(internalValue).isEqualTo(value || '')) {
      setInternalValue(valueToInternalValue(value || ''));
    }
  }, [value]);

  function internalValueToValue(anInternalValue: string) {
    return new BigNumber(anInternalValue)
      .shiftedBy(denomination)
      .decimalPlaces(0);
  }

  function valueToInternalValue(aValue: BigNumber) {
    return aValue.shiftedBy(-denomination).toString();
  }

  function onMax() {
    // console.log('AmountSelector::onMax');

    if (internalValue != valueToInternalValue(max)) {
      setInternalValue(valueToInternalValue(max));
    } else {
      setInternalValue('');
    }
  }

  function onValueChanged(values: NumberFormatValues) {
    setInternalValue(values.value);

    const newValue = internalValueToValue(values.value);

    if (newValue.isNaN()) {
      onChange && onChange(undefined);
    } else {
      onChange && onChange(newValue);
    }
  }

  return (
    <div className='flex flex-col'>
      <div
        className={`amount-selector input-group-amount ${
          invalid ? 'is-invalid' : ''
        }`}
      >
        <div className='flex gap-3'>
          {showMaxButton && (
            <Button color='emerald' disabled={disabled} onClick={() => onMax()}>
              max
            </Button>
          )}

          <NumericFormat
            allowNegative={false}
            autoComplete='off'
            className={`flex-1 bg-black/50 text-white rounded rounded-lg p-2 shadow-inner ${
              invalid ? 'is-invalid' : ''
            }`}
            decimalScale={denomination}
            disabled={disabled}
            onValueChange={(values) => onValueChanged(values)}
            placeholder='amount'
            required={true}
            thousandSeparator=','
            value={internalValue !== undefined ? internalValue : ''}
            valueIsNumericString
          />
        </div>

        {invalid && (
          <div className='flex justify-end text-red-500'>
            {value && min && value.isLessThan(min) && (
              <>Invalid amount (min: {valueToInternalValue(min)})</>
            )}
            {value && max?.isLessThan(value) && (
              <>Invalid amount (max: {valueToInternalValue(max)})</>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
