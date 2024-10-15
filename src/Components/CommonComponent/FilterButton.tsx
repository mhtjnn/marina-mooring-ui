import { Button } from "primereact/button";
import React, { ReactNode } from "react";

interface ButtonCompProps {
    onClick: () => void;
    disabled?: boolean;
    label: string;
    style?: React.CSSProperties;
    size?: "small" | "large";
    icon?: JSX.Element;
    color?: string;
    children?: ReactNode;
    text?: boolean;
}

const FilterButton: React.FC<ButtonCompProps> = ({
    onClick,
    disabled,
    label,
    style,
    size,
    icon,
    color,
    children,
}) => {
    return (
        <>
            <div className="relative">
                <img
                    src="assets/images/key.png"
                    alt="icon"
                />
                <Button
                    onClick={onClick}
                    disabled={disabled}
                    label={label}
                    style={style}
                    size={size}
                    icon={icon}
                    color={color}
                    children={children}
                />
            </div>

        </>
    );
};

export default FilterButton;
