import React from 'react'

interface Props{
    label:string,
    name:string,
    stylesLabel?:string,
    stylesInput?:string,
    type:string,
    placeHolder?:string,
    Icon?:React.ElementType
}

export const InputWithLabel = ({
    label,
    name,
    stylesLabel = '',
    stylesInput = '',
    type = "text",
    placeHolder="",
    Icon
}:Props) => {
  return (
    <div>
    <label
      className={stylesLabel || "mb-3 mt-5 block text-lg font-medium text-gray-900"}
      htmlFor={name}
    >
      {label}
    </label>
    <div className="relative">
      <input
        className={stylesInput || "peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"}
        id={name}
        type={type}
        name={name}
        placeholder={placeHolder}
        required
      />
      {Icon && <Icon />}
    </div>
  </div>
  )
}
