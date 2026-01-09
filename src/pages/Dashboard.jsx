import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaList,
  FaDonate,
  FaCalendarAlt,
  FaUsers,
} from "react-icons/fa";

import StatCard from "../pages/StatCard";
import { getCategories } from "../services/categories.service";
import { getDonations } from "../services/donations.service";
import { getEvents } from "../services/events.service";
import { getContacts } from "../services/contacts.service";

import "../styles/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [stats, setStats] = useState({
    categories: 0,
    donations: 0,
    events: 0,
    contacts: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  // ================= LOAD DATA =================
  const loadDashboardData = async () => {
    try {
      const [categories, donations, events, contacts] = await Promise.all([
        getCategories(),
        getDonations(),
        getEvents(),
        getContacts(),
      ]);

      setStats({
        categories: categories.length,
        donations: donations.length,
        events: events.length,
        contacts: contacts.length,
      });

      setRecentActivity(
        buildRecentActivity({
          donations,
          events,
          contacts,
        })
      );
    } catch (err) {
      console.error("Dashboard load error:", err);
    }
  };

  // 🔥 REFRESH DASHBOARD WHEN ROUTE CHANGES
  useEffect(() => {
    loadDashboardData();
  }, [location.pathname]);

  // ================= ACTIVITY BUILDER =================
  const buildRecentActivity = ({ donations, events, contacts }) => {
    const activity = [];

    donations.slice(0, 2).forEach((d) => {
      activity.push({
        text: `New donation "${d.title}" added`,
        time: d.created_at,
        type: "donation",
      });
    });

    events.slice(0, 2).forEach((e) => {
      activity.push({
        text: `Event "${e.title}" updated`,
        time: e.created_at,
        type: "event",
      });
    });

    contacts.slice(0, 1).forEach((c) => {
      activity.push({
        text: `New contact from ${c.name}`,
        time: new Date().toISOString(),
        type: "contact",
      });
    });

    return activity
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5);
  };

  return (
    <div className="dashboard-container">
      {/* ===== HEADER ===== */}
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <p className="text-muted">
          Overview of your NGO activities and data
        </p>
      </div>

      {/* ===== STAT CARDS ===== */}
      <div className="dashboard-grid">
        <StatCard
          title="Categories"
          value={stats.categories}
          icon={<FaList />}
          bg="bg-category"
          to="/categories"
        />
        <StatCard
          title="Donations"
          value={stats.donations}
          icon={<FaDonate />}
          bg="bg-donation"
          to="/donations"
        />
        <StatCard
          title="Events"
          value={stats.events}
          icon={<FaCalendarAlt />}
          bg="bg-events"
          to="/events"
        />
        <StatCard
          title="Contacts"
          value={stats.contacts}
          icon={<FaUsers />}
          bg="bg-contacts"
          to="/contacts"
        />
      </div>

      {/* ===== RECENT ACTIVITY ===== */}
      {recentActivity.length > 0 && (
        <div className="card mt-4 border-0 shadow-sm">
          <div className="card-body">
            <h6 className="mb-3">Recent Activity</h6>

            <ul className="activity-list">
              {recentActivity.map((item, index) => (
                <li key={index} className={`activity-${item.type}`}>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
