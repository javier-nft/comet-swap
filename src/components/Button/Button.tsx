import type { PropsWithChildren, MouseEvent } from 'react';
import { WithClassnameType } from 'types';

interface ButtonType extends WithClassnameType, PropsWithChildren {
  active?: boolean;
  color?: 'gray' | 'emerald';
  onClick: (e: MouseEvent) => void;
  disabled?: boolean;
  dataTestId?: string;
  dataCy?: string;
  defaultClassName?: string;
  id?: string;
  type?: 'button' | 'submit' | 'reset';
  rounded?: 'lg' | 'xl' | 'full';
}

export const Button = ({
  active = true,
  children,
  color = 'emerald',
  onClick,
  disabled = false,
  type = 'button',
  id,
  className,
  defaultClassName = 'inline-block px-3 py-2 text-center hover:no-underline my-0 text-white mr-0 disabled:bg-gray-200 disabled:text-black disabled:cursor-not-allowed',
  rounded = 'lg',
  ...otherProps
}: ButtonType) => {
  const elementClassName =
    (defaultClassName || '') +
    ' ' +
    (className || '') +
    ' ' +
    `bg-${color}-600 hover:bg-${color}-700 rounded-${rounded}` +
    ' ' +
    (active ? '' : 'opacity-50');

  return (
    <button
      id={id}
      data-testid={otherProps['data-testid']}
      disabled={disabled}
      onClick={onClick}
      className={elementClassName}
      type={type}
    >
      {children}
    </button>
  );
};
