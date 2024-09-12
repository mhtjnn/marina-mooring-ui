import React from "react";
import { InputText } from "primereact/inputtext";

interface InputStyle {
  width?: string;
  height?: string;
  padding?: string;
  fontSize?: string;
  border?: string; 
  fontFamily?: string;
  borderRadius?: string; 
}

interface InputComponentProps {
  placeholder?: string;
  type?: "text" | "password" | "number" | "email" | "date";
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  style?: InputStyle;
  name?: string;
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
  name
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
      />
    </div>
  );
};

export default InputComponent;
