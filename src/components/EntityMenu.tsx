import MenuOption, {type MenuOptionProps} from "./MenuOption.tsx";
import './EntityMenu.css';

interface EntityMenuProps {
    menuOptions: MenuOptionProps[];
}

export default function EntityMenu(props:EntityMenuProps) {

    const menuElements = props.menuOptions.map(menuOption => (
            <MenuOption
                key={menuOption.key}
                image={menuOption.image}
                alt={menuOption.alt}
                text={menuOption.text}
                onClick={menuOption.onClick}
            />
        )
    )

    return (
        <div className='menu-buttons'>
            {menuElements}
        </div>
    );
}
