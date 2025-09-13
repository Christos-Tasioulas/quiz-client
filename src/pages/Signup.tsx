import React, {useState} from "react";
import {Link} from "react-router-dom";
import FormInputs from "../components/FormInputs.tsx";
import type {TextInputProps, User} from "../types/BasicTypes.tsx";
import {createUser} from "../services/auth-api.tsx";
import type {SignupFormData} from "../types/SignupFormData.tsx";
import {authService} from "../services/auth-service.tsx";
import './Signup.css';

export default function Signup() {

    // State used to determine if the user is registered or not
    const [isRegistered, setIsRegistered] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    /**
     * State that contains the data obtained from the form.
     * Changes whenever a field on the form changes
     */
    const [formData, setFormData] = useState<SignupFormData>({
        username: "",
        password: "",
        passwordConfirm: "",
        firstName: "",
        lastName: "",
        email: "",
    })

    // Message state that prints to the user if an error occurred in the register process
    const [message, setMessage] = useState("")

    /**
     * All the input fields inside the form
     * In our formData object, the name attribute of the input is the name of the respective field as well
     * In our formData object, the value attribute of the input is the value of respective the field as well
     */
    const textInputs: TextInputProps[] = [
        {id:1, type: "text", placeholder: "Username", className:"signup-form-input", name: "username", value: formData.username},
        {id:4, type: "text", placeholder: "First name", className:"signup-form-input", name: "firstName", value: formData.firstName},
        {id:5, type: "text", placeholder: "Last name", className:"signup-form-input", name: "lastName", value: formData.lastName},
        {id:6, type: "email", placeholder: "Email", className:"signup-form-input", name: "email", value: formData.email},
        {id:2, type: "password", placeholder: "Password", className:"signup-form-input", name: "password", value: formData.password},
        {id:3, type: "password", placeholder: "Confirm Password", className:"signup-form-input", name: "passwordConfirm", value: formData.passwordConfirm},
    ]

    // This is where we change the formData members accordingly
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value, type, checked } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value
        }));
    }

    function validateForm(): string | null {
        if (!formData.username) return "Please enter a username";
        if (!formData.password || !formData.passwordConfirm) return "Please enter a password twice";
        if (!formData.firstName || !formData.lastName) return "Please enter your name";
        if (!formData.email) return "Please enter your email address";
        if (formData.password !== formData.passwordConfirm) return "Passwords do not match";
        return null;  // No errors
    }


    // Registration process begins and ends here
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const errorMessage = validateForm();
        if (errorMessage) {
            setMessage(errorMessage);
            return;
        }

        setIsLoading(true)

        try {
            const requestData: User = {
                username: formData.username,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                role: "USER",
                preferredTheme: "DARK"
            };

            const registration = await createUser(requestData);
            setIsRegistered(true);
            authService.setToken(registration.token);
            window.location.href = '/'

        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                setMessage(error.message);
            } else {
                setMessage("An unknown error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <main className="signup-form-container">
            {!isRegistered && !isLoading && <form className="signup-form" onSubmit={handleSubmit}>
                {/* Any error will be printed to the user here */}
                {message !== "" && <h3 className="signup-form-message">{message}</h3>}
                <h1>Let's Get You Started!</h1>
                <br />
                <FormInputs textInputs={textInputs} handleChange={handleChange} />
                <br /><br /><br />
                {/* In React Submit input can be labeled as button inside forms */}
                <button
                    className="signup-form-submit"
                >
                    Sign up
                </button>
                {/* Redirecting to login if needed */}
                <p>Already have an <Link to='/login'>Account</Link>?</p>
            </form>}
        </main>
    )
}