import {Link, useNavigate} from "react-router-dom";
import React, {type ChangeEvent, useContext, useEffect, useState} from "react";
import {ThemeContext} from "../context/ThemeContext.tsx";
import type {User} from "../types/BasicTypes.tsx";
import {fetchCurrentUser, updateUser} from "../services/user-api.tsx";
import type {SignupFormData} from "../types/SignupFormData.tsx";
import TextInput from "../components/TextInput.tsx";
import './EditProfile.css'

export default function EditProfile(props: { token: string; }) {
    const {theme, toggleTheme} = useContext(ThemeContext);
    const [currentUser, setCurrentUser] = useState<User>({} as User);

    const navigate = useNavigate();

    useEffect(() => {
        if (!props.token) return;

        const getCurrentUser = async () => {
            try {
                const userResponse = await fetchCurrentUser();
                setCurrentUser(userResponse);
            } catch (error) {
                console.error("Failed to fetch current user:", error);
            }
        };

        getCurrentUser();
    }, [props.token])

    // This state will be needed to save the user changes in a safe manner
    const [hasMadeChanges, setHasMadeChanges] = useState(false);

    // Message state that prints to the user if an error occurred in the update process
    const [message, setMessage] = React.useState("")

    const [formData, setFormData] = useState<SignupFormData>({
        username: "",
        password: "",
        passwordConfirm: "",
        firstName: "",
        lastName: "",
        email: "",
    })

    /**
     * All the input fields inside the form
     * In our formData object, the name attribute of the input is the name of the respective field as well
     * In our formData object, the value attribute of the input is the value of respective the field as well
     */
    const textInputs = [
        {
            id: 1,
            type: "text",
            placeholder: "Change Username",
            className: "form-input",
            name: "username",
            value: formData.username
        },
        {
            id: 2,
            type: "password",
            placeholder: "Change Password",
            className: "form-input",
            name: "password",
            value: formData.password
        },
        {
            id: 3,
            type: "password",
            placeholder: "Confirm Changed Password",
            className: "form-input",
            name: "passwordConfirm",
            value: formData.passwordConfirm
        },
        {
            id: 4,
            type: "text",
            placeholder: "Change First name",
            className: "form-input",
            name: "firstName",  // Make sure the name is "firstName"
            value: formData.firstName
        },
        {
            id: 5,
            type: "text",
            placeholder: "Change Last name",
            className: "form-input",
            name: "lastName",
            value: formData.lastName
        },
        {
            id: 6,
            type: "email",
            placeholder: "Change Email",
            className: "form-input",
            name: "email",
            value: formData.email
        },
    ]

    // Edit Profile Input html elements
    // We are reusing the ones we used in the signup component
    const textInputElements = textInputs.map(textInput => (
        <TextInput
            key={textInput.id}
            type={textInput.type}
            placeholder={textInput.placeholder}
            className={textInput.className}
            name={textInput.name}
            value={textInput.value}
            onChange={(event) => handleChange(event)}
        />
    ))

    // This is where we change the formData members accordingly
    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value, type, checked } = event.target;
        // Handle other form fields
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value
        }));
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // Create an object to store the updated fields
        const updatedFields: Partial<User> = {};  // Partial<User> allows dynamic key updates

        // Dynamically check and collect the updated fields
        for (const key in formData) {
            // Skip the passwordConfirm field since it's not part of the actual update
            if (key === "passwordConfirm" || key === "password") continue;

            const currentFieldValue = currentUser[key as keyof User];  // Type assertion to User
            const newFieldValue = formData[key as keyof SignupFormData];  // Type assertion to SignupFormData

            // If the value has changed and is defined, update the updatedFields object
            if (newFieldValue && newFieldValue !== currentFieldValue) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                updatedFields[key as keyof User] = newFieldValue;  // Ensure the key exists in User
            }
        }

        // Handle password change separately
        if (formData.password !== "" && formData.password === formData.passwordConfirm) {
            updatedFields['password'] = formData.password;  // Add the password change here
        } else if (formData.password !== formData.passwordConfirm) {
            setMessage("Passwords do not match. Please confirm your new password.");
            return;
        }

        if (theme != currentUser.preferredTheme) {
            updatedFields["preferredTheme"] = theme;
        }

        // Check if any fields have changed and prepare the update payload
        if (Object.keys(updatedFields).length > 0) {
            // Apply the changes to the current user
            setHasMadeChanges(true);
            const updatedUser = { ...currentUser, ...updatedFields };

            // Call the API to update the user
            await updateUser(updatedUser.id?.toString(), updatedFields); // Use updatedFields directly

            // Optionally, you can update the local state as well after updating
            setCurrentUser({ ...currentUser, ...updatedUser });

            navigate("/profile")
        } else {
            setMessage("No changes made.");
        }
    }



    return (
        <main className="edit-profile-container">
            {!hasMadeChanges && <form className="edit-profile" onSubmit={handleSubmit}>
                {/* Any error will be printed to the user here */}
                {message !== "" && <h3 className="message">{message}</h3>}
                <h1>Edit your Account!</h1>
                <br/>
                <div className="inputs">
                    <div className="text-inputs">
                        {textInputElements}
                    </div>
                    <div className="other-inputs">

                        {/* Contact Section in the profile page */}
                        <div className='preferences'>
                            <h2 className='preferences-title'>Preferences:</h2>
                            <div className="theme-toggle">
                                <span>Theme:</span>
                                <label>
                                    <input
                                        type="radio"
                                        name="theme"
                                        value="light"
                                        checked={theme === 'LIGHT'}
                                        onChange={toggleTheme}
                                    />
                                    Light
                                </label>
                                <label style={{marginLeft: '1rem'}}>
                                    <input
                                        type="radio"
                                        name="theme"
                                        value="dark"
                                        checked={theme === 'DARK'}
                                        onChange={toggleTheme}
                                    />
                                    Dark
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <br/><br/><br/>
                {/* In React Submit input can be labeled as button inside forms */}
                <button
                    className="form-submit"
                >
                    Save Changes
                </button>
                <br/>
                <Link to="/profile">
                    Go Back
                </Link>
            </form>}
        </main>
    )
}