import './MenuOption.css'
import React from "react";

export interface MenuOptionProps {
    key: number;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    text: string;
    onClick?: () => void;
}

export default function MenuOption(props: MenuOptionProps) {

    return (
        <button onClick={props.onClick}>
            <div className="menu-option">
                <div className="menu-button">
                    <div className="menu-favicon-container">
                        <props.Icon />
                    </div>
                    <span>{props.text}</span>
                </div>
            </div>
        </button>
    );

}