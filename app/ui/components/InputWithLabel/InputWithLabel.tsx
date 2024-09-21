import React from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  stylesLabel?: string;
  stylesInput?: string;
  type?: string;
  placeHolder?: string;
  Icon?: React.ElementType;
  required?: boolean;
  defaultValue?: any;
  wrong?: boolean;
  value?: any;
  iconClassName?: string;
  onClickIcon?: any;
  ref?: any;
}

export const InputWithLabel = ({
  label,
  name,
  stylesLabel = '',
  stylesInput = '',
  type = 'text',
  placeHolder = '',
  Icon,
  required = false,
  defaultValue = undefined,
  wrong = false,
  iconClassName = 'cursor-pointer absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900',
  onClickIcon,
  ref = null,
  ...props
}: Props) => {
  return (
    <div>
      {label && (
        <label
          className={
            stylesLabel || 'mb-3 mt-5 block text-lg font-medium text-gray-900'
          }
          htmlFor={name}
        >
          {label}
          {required && <label className="text-red-600"> *</label>}
        </label>
      )}
      <div className="relative">
        <input
          className={
            stylesInput ||
            `peer block w-full rounded-md border ${wrong ? 'border-red-600' : 'border-gray-200'} py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500`
          }
          id={name}
          type={type}
          name={name}
          placeholder={placeHolder}
          defaultValue={defaultValue}
          ref={ref}
          {...props}
        />
        {Icon && (
          <Icon className={iconClassName} onClick={onClickIcon || null} />
        )}
      </div>
    </div>
  );
};
