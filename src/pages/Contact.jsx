import { useEffect, useState } from "react";
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} from "../services/contacts.service";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("add"); // add | view | edit

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
    number: "",
    message: "",
  });

  // ================= LOAD =================
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const data = await getContacts();
      setContacts(data);
    } catch (err) {
      console.error("CONTACT FETCH ERROR:", err);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= ACTIONS =================
  const handleAdd = () => {
    setMode("add");
    setFormData({
      id: null,
      name: "",
      email: "",
      number: "",
      message: "",
    });
    setShowForm(true);
  };

  const handleView = (item) => {
    setMode("view");
    setFormData(item);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setMode("edit");
    setFormData(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this contact?")) return;
    await deleteContact(id);
    fetchContacts();
  };

  // ================= SUBMIT =================
const handleSubmit = async (e) => {
  e.preventDefault();

  // ================= VALIDATION =================

  const name = formData.name.trim();
  const number = String(formData.number).trim();

  // Name validation (max 100 characters)
  if (name.length === 0) {
    alert("Name is required");
    return;
  }

  if (name.length > 100) {
    alert("Name cannot exceed 100 characters");
    return;
  }

  // Number validation (exactly 10 digits)
  if (!/^\d{10}$/.test(number)) {
    alert("Contact number must be exactly 10 digits");
    return;
  }

  try {
    const payload = {
      name,
      email: formData.email.trim(),
      number,
      message: formData.message.trim(),
    };

    if (mode === "add") await createContact(payload);
    if (mode === "edit") await updateContact(formData.id, payload);

    setShowForm(false);
    fetchContacts();
  } catch (err) {
    console.error("CONTACT SAVE ERROR:", err.response?.data || err);
    alert("Contact save failed");
  }
};


  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {/* ================= HEADER ================= */}
      {!showForm && (
        <div className="mb-4">
          <h2 className="mb-3">📞 Contacts</h2>
          <div className="d-flex justify-content-end">
            <button className="btn btn-primary" onClick={handleAdd}>
              + Add Contact
            </button>
          </div>
        </div>
      )}

      {/* ================= FORM ================= */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between">
            <strong className="text-capitalize">{mode} Contact</strong>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setShowForm(false)}
            >
              ← Back
            </button>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* NAME */}
             <input
  className="form-control mb-2"
  placeholder="Name"
  value={formData.name || ""}
  onChange={(e) => {
    if (e.target.value.length <= 100) {
      setFormData({ ...formData, name: e.target.value });
    }
  }}
  disabled={mode === "view"}
  required
/>


              {/* EMAIL */}
              <input
                type="email"
                className="form-control mb-2"
                placeholder="Email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={mode === "view"}
                required
              />

              {/* NUMBER */}
             <input
  type="text"
  className="form-control mb-2"
  placeholder="Phone Number"
  value={formData.number || ""}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setFormData({ ...formData, number: value });
    }
  }}
  disabled={mode === "view"}
  required
/>


              {/* MESSAGE */}
              <textarea
                className="form-control mb-3"
                placeholder="Message"
                rows="3"
                value={formData.message || ""}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                disabled={mode === "view"}
              />

              {/* SUBMIT */}
              {mode !== "view" && (
                <button className="btn btn-success">
                  {mode === "add" ? "Save Contact" : "Update Contact"}
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
              <th>Name</th>
              <th>Email</th>
              <th>Number</th>
              <th>Message</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {contacts.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted py-4">
                  No contacts found
                </td>
              </tr>
            )}

            {contacts.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.number}</td>
                <td className="text-truncate" style={{ maxWidth: 200 }}>
                  {item.message}
                </td>
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
