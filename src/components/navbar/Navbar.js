import './navbar.css'
import { useLocation } from "react-router-dom";
import { useState} from 'react';
import { FaCog } from 'react-icons/fa';
import FullScreenButton from '../FullScreenButton';

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [isLogIn, setIsLogIn] = useState(true);


    const location = useLocation();

    // Extract the last segment of the pathname (e.g., 'dashboard' from '/dashboard')
    const pathSegments = location.pathname.split('/').filter(Boolean); // removes empty strings
    const rawPageName = pathSegments[pathSegments.length - 1] || 'signup';
    
    const pageNameMap = {
      pquotation: 'Quotation',
      signup: 'Sign Up',
      dashboard: 'Dashboard',
      // Add more routes as needed
    };
    
    const capitalizedPageName = pageNameMap[rawPageName.toLowerCase()] || 
                                rawPageName.charAt(0).toUpperCase() + rawPageName.slice(1);
    
    const username = localStorage.getItem("username") || "User";
    


    return (
        <div className="main">
            <div className="navbar">

                <h1 className="shining-heading" style={{ color: '#ee801a' }}> {capitalizedPageName}</h1>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <h3>{isLogIn ? "Welcome User" : "Login"}</h3>
                    <button className="settings-icon" onClick={() => setOpen(!open)}>
                        <FaCog size={24} />
                    </button>
                </div>
                {open && (
                    <div className="settings-panel">
                        <h3>Settings</h3>
                        <div className="setting-option disabled">
                            <label>Dark Mode</label>
                            <input type="checkbox" />
                        </div>
                        <div className="setting-option disabled">
                            <label>Notifications</label>
                            <input type="checkbox" />
                        </div>
                        <div className="setting-option disabled" >
                            <label>Language</label>
                            <select>
                                <option>English</option>
                                <option>Hindi</option>
                                <option>Spanish</option>
                            </select>
                        </div>
                        <div className="setting-option">
                            <button className="logout-btn">{isLogIn ? "Logout" : "Login"}</button>
                        </div>
                        <div>
                            <FullScreenButton />
                        </div>
                    </div>
                )}
            </div>

        </div>
    )
}

export default Navbar