import { InputText } from 'primereact/inputtext'
import React from 'react'
import { IoSearch } from 'react-icons/io5'
interface inputHeader {
  header: string
  style?: React.CSSProperties
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  headerStyle?: React.CSSProperties
  inputTextStyle: React.CSSProperties
  value?: string | undefined
}
const InputTextWithHeader: React.FC<inputHeader> = ({
  header,
  style,
  onChange,
  placeholder,
  headerStyle,
  inputTextStyle,
  value,
}) => {
  return (
    <>
      <div className="text-sm font-extrabold rounded-sm w-full  bg-[#D9D9D9]">
        <h1 style={headerStyle} className="p-4">
          {header}
        </h1>
      </div>

      <div className="flex items-center justify-center mt-2 bg-[#F2F2F2]">
        <div className="p-input-icon-left ">
          <IoSearch style={style} />
          <InputText
            placeholder={placeholder}
            style={inputTextStyle}
            onChange={onChange}
            value={value}
          />
        </div>
      </div>
    </>
  )
}

export default InputTextWithHeader
