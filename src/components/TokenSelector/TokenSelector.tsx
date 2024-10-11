import { Token } from 'types';

export const TokenSelector = ({
  tokens,
  value,

  onChange
}: {
  tokens: Token[];
  value: Token;

  onChange: (newValue: Token) => any;
}) => {
  function onSelectChanged(e: React.ChangeEvent<HTMLSelectElement>) {
    const t = tokens.find((x) => x.id === e.target.value);

    if (t) {
      onChange(t);
    }
  }
  return (
    <div className='flex px-2 bg-black/50 rounded rounded-lg'>
      <select
        className='flex py-2 rounded rounded-lg bg-transparent text-white focus:border-none'
        value={value.id}
        onChange={(e) => onSelectChanged(e)}
      >
        {tokens.map((t) => (
          <option
            className='bg-black/50 text-white'
            key={`option-${Math.random()}`}
            value={t.id}
            label={t.id.split('-')[0]}
          >
            {t.id}
          </option>
        ))}
      </select>
    </div>
  );
};
