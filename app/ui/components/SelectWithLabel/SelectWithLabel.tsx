import React from 'react';
import Select from 'react-select';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  stylesLabel?: string;
  stylesInput?: string;
  placeHolder?: string;
  Icon?: React.ElementType;
  required?: boolean;
  defaultValue?: any;
  wrong?: boolean;
  value?: any;
  iconClassName?: string;
  onClickIcon?: any;
  options: any;
}

export const SelectWithLabel = ({
  label,
  name,
  stylesLabel = '',
  stylesInput = '',
  placeHolder = '',
  Icon,
  required = false,
  defaultValue = undefined,
  wrong = false,
  iconClassName = 'cursor-pointer absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900',
  onClickIcon,
  options = [{}],
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
        <Select
          styles={{
            control: (base) => ({
              ...base,
              borderColor: wrong ? '#dc2626' : '',
            }),
          }}
          id={name}
          name={name}
          placeholder={placeHolder}
          defaultValue={defaultValue}
          options={options}
          {...props}
        />
        {Icon && (
          <Icon className={iconClassName} onClick={onClickIcon || null} />
        )}
      </div>
    </div>
  );
};
