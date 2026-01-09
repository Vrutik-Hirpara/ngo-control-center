import { useNavigate } from "react-router-dom";

export default function StatCard({ title, value, icon, bg, to }) {
  const navigate = useNavigate();

  return (
    <div className={`stat-card ${bg}`} onClick={() => navigate(to)}>
      <div className="stat-icon">{icon}</div>

      <div className="stat-content">
        <span className="stat-title">{title}</span>
        <h3 className="stat-value">{value}</h3>
      </div>
    </div>
  );
}
