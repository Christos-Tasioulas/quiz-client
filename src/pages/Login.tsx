import {Link} from "react-router-dom";
import React, {useState} from "react";
import FormInputs from "../components/FormInputs.tsx";
import type {BaseFormData, UserCredentials} from "../types/BasicTypes.tsx";
import {login} from "../services/auth-api.tsx";
import {authService} from "../services/auth-service.tsx";
import './Login.css';

export default function Login() {
    /**
     * State that contains the data obtained from the form.
     * Changes whenever a field on the form changes
     */
    const [formData, setFormData] = useState<BaseFormData>({
        username: "",
        password: ""
    });

    const [message, setMessage] = useState<string>("");

    /**
     * All the input fields inside the form
     * In our formData object, the name attribute of the input is the name of the respective field as well
     * In our formData object, the value attribute of the input is the value of respective the field as well
     */
    const textInputs = [
        {id:1, type: "text", placeholder: "Username", className: "login-form-input", name: "username", value: formData.username},
        {id:2, type: "password", placeholder: "Password", className: "login-form-input", name: "password", value: formData.password}
    ]

    // This is where we change the formData members accordingly
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value, type, checked } = event.target;

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value
        }));
    }


    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const requestData: UserCredentials = {
            username: formData.username,
            password: formData.password
        };

        try {
            const registration = await login(requestData);
            authService.setToken(registration.token);
            // onLogin();
            window.location.href = '/'
        } catch (error) {
            if (error instanceof Error) {
                setMessage(error.message);
            } else {
                setMessage("Unexpected error occurred.");
            }
        }
    }

    return (
        <div className="login">
            <form className="login-form" onSubmit={handleSubmit}>
                {message !== "" && <h3 className="form-message">{message}</h3>}
                <h1>Login</h1>
                <br/>
                <FormInputs textInputs={textInputs} handleChange={handleChange} />
                <br/><br/><br/>
                {/* In React Submit input can be labeled as button inside forms */}
                <button
                    className="login-form-submit"
                >
                    Login
                </button>
                {/* Redirecting to signup if needed */}
                <p>Don't have an account? <Link to='/signup'>Register!</Link></p>
            </form>
        </div>
    )
}