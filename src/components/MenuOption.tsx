import './MenuOption.css'

export interface MenuOptionProps {
    key: number;
    image: string;
    alt: string;
    text: string;
    onClick?: () => void;
}

export default function MenuOption(props: MenuOptionProps) {

    return (
        <button onClick={props.onClick}>
            <div className="menu-option">
                <div className="menu-button">
                    <div className="menu-favicon-container">
                        <img
                            src={props.image}
                            alt={props.alt} className="menu-favicon"/>
                    </div>
                    <span>{props.text}</span>
                </div>
            </div>
        </button>
    );

}