import {useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import type {User} from "../types/BasicTypes.tsx";
import {deleteUser, fetchCurrentUser, fetchUserById} from "../services/user-api.tsx";
import {ThemeContext} from "../context/ThemeContext.tsx";
import deleteDark from "../assets/bin-shapes-and-symbols-svgrepo-com.svg";
import deleteLight from "../assets/bin-shapes-and-symbols-svgrepo-com-light.svg";
import './UserInfo.css'
import Modal from "../components/Modal.tsx";
import EntityMenu from "../components/EntityMenu.tsx";

export default function UserInfo(props: { token: string; }) {

    const [currentUser, setCurrentUser] = useState<User>({} as User);
    const [user, setUser] = useState<User>({} as User);
    const {theme} = useContext(ThemeContext);
    // Retrieving the id of the user from the url parameter
    const { id } = useParams()
    const [isModalOpen, setIsModalOpen] = useState(false);
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

        const getUserById = async () => {
            try {
                if (currentUser.role == "ADMIN") {
                    const userResponse = await fetchUserById(id || "")
                    setUser(userResponse)
                }
            }
            catch(error) {
                console.error("Failed to fetch user:", error);
            }
        }

        getCurrentUser();
        getUserById();
    }, [currentUser.role, id, props.token])


    // All the favicons shown in the contact section of the user profile
    const contacts = [
        {id:1, favicon: 'https://cdn3.iconfinder.com/data/icons/social-messaging-ui-color-line/245532/72-512.png', alt:"email", name: user.email},
    ]

    // User contact information as html elements
    const contactElements = contacts.map(contact =>
        <div key={contact.id} className='profile-contact'>
            <img src={contact.favicon} alt={contact.alt} />
            <h3>{contact.name}</h3>
        </div>
    )

    // Toggle the modal visibility
    const openModal = () => {
        setIsModalOpen(true);
    };

    const handleDelete = () => {
        openModal(); // Open the modal when delete is triggered
    };

    const confirmDelete = async () => {
        try {
            await deleteUser(user.id?.toString())
            console.log('User deleted');
            setIsModalOpen(false);  // Close the modal after confirmation
            navigate("/users")
        }
        catch (error : unknown) {
            console.log(error)
        }
    };

    const cancelDelete = () => {
        setIsModalOpen(false);  // Close the modal if the user cancels
    };

    const menuOptions = [
        {
            key: 1,
            image: theme == "LIGHT" ? deleteLight : deleteDark,
            alt: "Delete Question",
            text: "Delete Question",
            onClick: handleDelete
        }
    ]

    return (
        <main className="userinfo-container">
            <div className="user-info">
                <div className="user">
                    {/* Delete Profile Button */}
                    <EntityMenu menuOptions={menuOptions}/>
                    <div className="userInfo">
                        {/* Important User Info */}
                        <h2 className='fullname'>{user.firstName} {user.lastName}</h2>
                        <h2 className='-username'>{user.username}</h2>
                        <h3 className='role'>{user.role}</h3>
                        <br/><br/><br/>
                        {/* Contact Section in the profile page */}
                        <div className='contacts'>
                            <h2 className='contacts-title'>Contact:</h2>
                            {contactElements}
                        </div>
                    </div>
                    {/* Conditionally render the modal */}
                    {isModalOpen && (
                        <Modal
                            message="Are you sure you want to delete this user?"
                            onConfirm={confirmDelete}
                            onCancel={cancelDelete}
                        />
                    )}
                </div>
            </div>
        </main>
    )
}