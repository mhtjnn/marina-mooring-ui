import React from "react";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";

interface DatePickerComponentProps {
  value?: Nullable<Date>;
  onChange: (newValue: Date) => void;
  format?: string;
  readOnly?: boolean;
  style?: React.CSSProperties;
  showIcon?: boolean;
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({
  value,
  style,
  onChange,
  showIcon,
}) => {
  return (
    <div>
      <div>
        <Calendar
          showIcon={showIcon}
          value={value}
          style={style}
          onChange={(e) => onChange(e.value as Date)}
        />
      </div>
    </div>
  );
};

export default DatePickerComponent;
