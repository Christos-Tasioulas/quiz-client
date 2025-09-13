import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import type {User} from "../types/BasicTypes.tsx";
import {fetchCurrentUser} from "../services/user-api.tsx";
import './Profile.css'
import gearIcon from "../assets/Gear_icon-72a7cf.svg"

export default function Profile(props: { token: string; }) {

    const [currentUser, setCurrentUser] = useState<User>({} as User);

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


    // All the favicons shown in the contact section of the user profile
    const contacts = [
        {id:1, favicon: 'https://cdn3.iconfinder.com/data/icons/social-messaging-ui-color-line/245532/72-512.png', alt:"email", name: currentUser.email},
    ]

    // User contact information as html elements
    const contactElements = contacts.map(contact =>
        <div key={contact.id} className='profile-contact'>
            <img src={contact.favicon} alt={contact.alt} />
            <h3>{contact.name}</h3>
        </div>
    )

    return (
        <main className="profile-container">
            <div className="profile">
                <div className="user">
                    {/* Edit Profile Button */}
                    <Link to='/editprofile' style={{position: "relative", left: "35%"}}>
                        <div className="edit">
                            <div className="edit-button">
                                <div className="edit-cog">
                                    <img
                                        src={gearIcon}
                                        alt="Edit-profile" className="edit-favicon"/>
                                </div>
                                <span>Edit Account</span>
                            </div>
                        </div>
                    </Link>
                    <div className="userInfo">
                        {/* Important User Info */}
                        <h2 className='fullname'>{currentUser.firstName} {currentUser.lastName}</h2>
                        <h2 className='-username'>{currentUser.username}</h2>
                        <h3 className='role'>{currentUser.role}</h3>
                        <br/><br/><br/>
                        {/* Contact Section in the profile page */}
                        <div className='contacts'>
                            <h2 className='contacts-title'>Contact:</h2>
                            {contactElements}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}