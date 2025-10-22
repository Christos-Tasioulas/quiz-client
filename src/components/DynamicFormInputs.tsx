import type {TextInputProps} from "../types/BasicTypes.tsx";
import React, {useState} from "react";
import TextInput from "./TextInput.tsx";

interface DynamicFormInputsProps {
    initialInputs?: TextInputProps[];
    handleChange: (event: React.ChangeEvent<HTMLInputElement>, id: number) => void;
    handleRemove: (values: string[]) => void;
    textInputClassName: string
}

const DynamicFormInputs: React.FC<DynamicFormInputsProps> = ({
                                                                 initialInputs = [],
                                                                 handleChange,
                                                                 handleRemove,
                                                                 textInputClassName
                                                             }) => {
    const [inputs, setInputs] = useState<TextInputProps[]>(initialInputs);

    // Add a new input
    const addInput = () => {
        const newInput: TextInputProps = {
            id: Date.now(), // simple unique id
            type: "text",
            placeholder: "New field",
            className: textInputClassName || "form-input",
            name: `field-${inputs.length + 1}`,
            value: "",
        };
        setInputs([...inputs, newInput]);
    };

    // Remove an input by id
    const removeInput = (id: number) => {
        const updated = inputs.filter((input) => input.id !== id);
        setInputs(updated);
        handleRemove(updated.map(i => i.value)); // Notify parent
    };

    // Handle local changes and bubble them up
    const onChange = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
        const updatedInputs = inputs.map((input) =>
            input.id === id ? {...input, value: event.target.value} : input
        );
        setInputs(updatedInputs);
        handleChange(event, id);
    };

    return (
        <div className="form-inputs">
            <div className="form-text-inputs">
                {inputs.map((textInput) => (
                    <div key={textInput.id} className="input-row">
                        <TextInput
                            type={textInput.type}
                            placeholder={textInput.placeholder}
                            className={textInput.className}
                            name={textInput.name}
                            value={textInput.value}
                            onChange={(e) => onChange(e, textInput.id)}
                        />
                        <button
                            type="button"
                            className="remove-button"
                            onClick={() => removeInput(textInput.id)}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            <button type="button" className="add-button" onClick={addInput}>
                + Add Field
            </button>
        </div>
    );
};

export default DynamicFormInputs;