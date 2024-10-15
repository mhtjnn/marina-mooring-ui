import React, { ChangeEvent } from "react";
import { InputTextarea } from "primereact/inputtextarea";

interface TextAreaComponentProps {
  value?: string;
  onChange: (value: string) => void;
  rows?: number;
  cols?: number;
  style?: React.CSSProperties;
}

const TextAreaComponent: React.FC<TextAreaComponentProps> = ({
  value = "",
  onChange,
  rows = 5,
  cols = 30,
  style,
}) => {
  return (
    <div className="card flex justify-content-center">
      <InputTextarea
        autoResize
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          onChange(e.target.value)
        }
        rows={rows}
        cols={cols}
        style={style}
      />
    </div>
  );
};

export default TextAreaComponent;
