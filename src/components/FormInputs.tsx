import type {TextInputProps} from '../types/BasicTypes.tsx';
import TextInput from "./TextInput.tsx";
import React from "react";  // Import your type if needed

interface FormInputsProps {
    textInputs: TextInputProps[];
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInputs: React.FC<FormInputsProps> = ({textInputs, handleChange}) => {
    return (
        <div className="form-inputs">
            <div className="form-text-inputs">
                {textInputs.map(textInput => (
                    <TextInput
                        key={textInput.id}
                        type={textInput.type}
                        placeholder={textInput.placeholder}
                        className={textInput.className}
                        name={textInput.name}
                        value={textInput.value}
                        onChange={handleChange}
                    />
                ))}
            </div>
        </div>
    );
};

export default FormInputs;
