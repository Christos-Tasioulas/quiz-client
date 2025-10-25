import './ErrorMessage.css';

export default function ErrorMessage(props: { message: string }) {
    return (
        props.message !== "" && <div className="error-message-container">
            <h3>{props.message}</h3>
        </div>
    )
}