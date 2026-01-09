import { useEffect, useState } from "react";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../services/events.service";
import { getCategories } from "../services/categories.service";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Events() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("add"); // add | view | edit

  const [formData, setFormData] = useState({
    id: null,
    category_id: "",
    title: "",
    description: "",
    location: "",
    image: null, // string | File
  });

  // ================= LOAD =================
  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      console.error("EVENT FETCH ERROR:", err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("CATEGORY FETCH ERROR:", err);
      setCategories([]);
    }
  };

  // ================= ACTIONS =================
  const handleAdd = () => {
    setMode("add");
    setFormData({
      id: null,
      category_id: "",
      title: "",
      description: "",
      location: "",
      image: null,
    });
    setShowForm(true);
  };

  const handleView = (item) => {
    setMode("view");
    setFormData({
      id: item.id,
      category_id: item.category_id,
      title: item.title,
      description: item.description,
      location: item.location,
      image: item.image,
    });
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setMode("edit");
    setFormData({
      id: item.id,
      category_id: item.category_id,
      title: item.title,
      description: item.description,
      location: item.location,
      image: item.image,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    await deleteEvent(id);
    fetchEvents();
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = new FormData();

      payload.append("category", Number(formData.category_id));
      payload.append("title", formData.title.trim());
      payload.append("description", formData.description.trim());
      payload.append("location", formData.location.trim());

      // ADD → image required
      if (mode === "add") {
        if (!(formData.image instanceof File)) {
          alert("Image is required");
          return;
        }
        payload.append("image", formData.image);
      }

      // EDIT → image optional
      if (mode === "edit" && formData.image instanceof File) {
        payload.append("image", formData.image);
      }

      if (mode === "add") await createEvent(payload);
      if (mode === "edit") await updateEvent(formData.id, payload);

      setShowForm(false);
      fetchEvents();
    } catch (err) {
      console.error("EVENT SAVE ERROR:", err.response?.data || err);
      alert("Event save failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {/* ================= HEADER ================= */}
      {!showForm && (
        <div className="mb-4">
          <h2 className="mb-3">📅 Events</h2>
          <div className="d-flex justify-content-end">
            <button className="btn btn-primary" onClick={handleAdd}>
              + Add Event
            </button>
          </div>
        </div>
      )}

      {/* ================= FORM ================= */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between">
            <strong className="text-capitalize">{mode} Event</strong>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setShowForm(false)}
            >
              ← Back
            </button>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* CATEGORY */}
              <select
                className="form-control mb-2"
                value={formData.category_id || ""}
                onChange={(e) =>
                  setFormData({ ...formData, category_id: e.target.value })
                }
                disabled={mode === "view"}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title}
                  </option>
                ))}
              </select>

              {/* TITLE */}
              <input
                className="form-control mb-2"
                placeholder="Event Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                disabled={mode === "view"}
                required
              />

              {/* DESCRIPTION */}
              <textarea
                className="form-control mb-2"
                placeholder="Description"
                rows="3"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                disabled={mode === "view"}
              />

              {/* LOCATION */}
              <input
                className="form-control mb-3"
                placeholder="Location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                disabled={mode === "view"}
                required
              />

              {/* IMAGE PREVIEW */}
              {formData.image && typeof formData.image === "string" && (
                <div className="mb-3">
                  <img
                    src={`${BASE_URL}${formData.image}`}
                    alt="event"
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 10,
                      border: "1px solid #ddd",
                    }}
                  />
                </div>
              )}

              {/* IMAGE INPUT */}
              {mode !== "view" && (
                <input
                  type="file"
                  className="form-control mb-3"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                />
              )}

              {/* SUBMIT */}
              {mode !== "view" && (
                <button className="btn btn-success">
                  {mode === "add" ? "Save Event" : "Update Event"}
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ================= TABLE ================= */}
      {!showForm && (
        <table className="table category-table align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Location</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {events.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted py-4">
                  No events found
                </td>
              </tr>
            )}

            {events.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>
                  <img
                    src={`${BASE_URL}${item.image}`}
                    className="category-img"
                  />
                </td>
                <td>{item.title}</td>
                <td>{item.category_title}</td>
                <td>{item.location}</td>
                <td className="text-center">
                  <div className="action-group">
                    <button
                      className="btn btn-outline-info btn-sm"
                      onClick={() => handleView(item)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-outline-warning btn-sm"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
