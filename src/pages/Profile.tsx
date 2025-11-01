import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import type {User} from "../types/BasicTypes.tsx";
import {fetchCurrentUser} from "../services/user-api.tsx";
import './Profile.css'
// import gearIcon from "../assets/Gear_icon-72a7cf.svg"
import {Mail, Pencil} from "lucide-react";

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
        {id:1, Icon: Mail, name: currentUser.email},
    ]

    // User contact information as html elements
    const contactElements = contacts.map(contact =>
        <div key={contact.id} className='profile-contact'>
            <contact.Icon size={20}/>
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
                                <Pencil size={18} />
                                <span>Edit Account</span>
                            </div>
                        </div>
                    </Link>
                    <div className="userInfo">
                        {/* Important User Info */}
                        <h2 className='fullname'>{currentUser.firstName} {currentUser.lastName}</h2>
                        <h2 className='-username'>{currentUser.username}</h2>
                        <h3 className='role'>{currentUser.role}</h3>
                        <div>
                            <Link to="/runs/list">View Runs</Link>
                        </div>
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