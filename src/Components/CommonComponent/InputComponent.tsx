import React, { CSSProperties, FocusEventHandler } from 'react'
import { InputText } from 'primereact/inputtext'
import { BsEyeSlash } from 'react-icons/bs'

interface InputStyle {
  width?: string
  height?: string
  padding?: string
  fontSize?: string
  border?: string
  fontFamily?: string
  borderRadius?: string
}

interface InputComponentProps {
  placeholder?: string
  type?: 'text' | 'password' | 'number' | 'email' | 'date' | 'file'
  accept?: 'image/*'
  value?: any
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  required?: boolean
  autoFocus?: boolean
  style?: React.CSSProperties
  name?: string
  onFocus?: any
  onBlur?: any
  onKeyDown?: any
  defaultValue?: any
  ref?: any
}

const InputComponent: React.FC<InputComponentProps> = ({
  placeholder,
  type,
  value,
  onChange,
  disabled,
  required,
  autoFocus,
  style,
  name,
  onFocus,
  onBlur,
  onKeyDown,
  defaultValue,
  ref,
}) => {
  return (
    <div className="p-inputgroup">
      <InputText
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        autoFocus={autoFocus}
        name={name}
        style={style}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        defaultValue={defaultValue}
        ref={ref}
      />
    </div>
  )
}

export default InputComponent
