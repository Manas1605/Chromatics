import React, { useState } from 'react'
import './sidebar.css'
import { NavLink } from 'react-router-dom';
import logo from '../../assets/logo.png'
import onlyLogo from '../../assets/onlyLogo.png'
import home from '../../assets/home.svg'
import employee from '../../assets/employee.svg'
import help from '../../assets/help.svg'
import inventory from '../../assets/inventory.svg'
import invoice from '../../assets/invoice.svg'
import projects from '../../assets/projects.svg'
import tasks from '../../assets/tasks.svg'
import quotation from '../../assets/quotation.svg'

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    

    const toggleSidebar = () => setIsOpen(!isOpen);

  
    return (
        <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
            <NavLink to="/" end>
                < div className="logo" >
                    {isOpen ? <img src={logo} alt="l" width="140px" className="shining-logo" /> : <img src={onlyLogo} alt="l" width="100px" className="shining-logo" />}
                </div>
            </NavLink>

            <div className="toggle-btn" onClick={toggleSidebar}>
                ☰
            </div>
            <div className="menu">
                <NavLink to="/dashboard" end className="nav-link">
                    {isOpen ? <span className="nav-text" >Home</span> :  <img src={home} alt="home" />}
                </NavLink>
                <NavLink to="/projects" className="nav-link">
                     {isOpen ? <span className="nav-text">Projects</span> : <img src={projects} alt="projects" />}
                </NavLink>
                <NavLink to="/employees" className="nav-link">
                   {isOpen ? <span className="nav-text">Employees</span> : <img src={employee} alt="employees" />}
                </NavLink>
                <NavLink to="/tasks" className="nav-link">
                    {isOpen ? <span className="nav-text">Tasks</span> :  <img src={tasks} alt="tasks" />}
                </NavLink>
                <NavLink to="/quotation" className="nav-link">
                     {isOpen ? <span className="nav-text">Quotation</span> : <img src={quotation} alt="quotation" />}
                </NavLink>
                <NavLink to="/invoice" className="nav-link">
                     {isOpen ? <span className="nav-text">Invoice</span> : <img src={invoice} alt="invoice" />}
                </NavLink>
                <NavLink to="/inventory" className="nav-link">
                    {isOpen ? <span className="nav-text">Inventory</span> :  <img src={inventory} alt="inventory" />}
                </NavLink>
                <NavLink to="/help-Support" className="nav-link">
                    {isOpen ? <span className="nav-text">Help & Support</span> : <img src={help} alt="help" /> }
                </NavLink>
            </div>

        </div>
    )
}

export default Sidebar