import type {ChangeEvent} from 'react';

interface TextInputProps {
    type?: string;
    placeholder?: string;
    className?: string;
    name?: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function TextInput(props: TextInputProps) {
    return (
        <input
            type={props.type}
            placeholder={props.placeholder}
            className={props.className}
            name={props.name}
            onChange={props.onChange}
            value={props.value}
        />
    );
}
