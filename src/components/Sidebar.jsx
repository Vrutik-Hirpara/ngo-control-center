import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaListAlt,
  FaDonate,
  FaCalendarAlt,
  FaAddressBook
} from "react-icons/fa";

import "../styles/sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h3 className="logo">Myron</h3>

      <nav>
        <NavLink to="/dashboard" className="sidebar-link">
          <FaHome /> Dashboard
        </NavLink>

        <NavLink to="/categories" className="sidebar-link">
          <FaListAlt /> Category
        </NavLink>

        <NavLink to="/donations" className="sidebar-link">
          <FaDonate /> Donations
        </NavLink>

        <NavLink to="/events" className="sidebar-link">
          <FaCalendarAlt /> Events
        </NavLink>

        <NavLink to="/contacts" className="sidebar-link">
          <FaAddressBook /> Contacts
        </NavLink>
      </nav>
    </aside>
  );
}
