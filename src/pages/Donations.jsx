import { useEffect, useState } from "react";
import {
  getDonations,
  createDonation,
  updateDonation,
  deleteDonation,
} from "../services/donations.service";
import { getCategories } from "../services/categories.service";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Donations() {
  const [donations, setDonations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("add"); // add | view | edit

  const [formData, setFormData] = useState({
    id: null,
    category_id: "",
    title: "",
    description: "",
    donation_goal: "",
    image: null, // string OR File
  });

  // ================= LOAD DATA =================
  useEffect(() => {
    fetchDonations();
    fetchCategories();
  }, []);

  const fetchDonations = async () => {
    try {
      const data = await getDonations();
      setDonations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("DONATION FETCH ERROR:", err);
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
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
      donation_goal: "",
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
      donation_goal: item.donation_goal,
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
      donation_goal: item.donation_goal,
      image: item.image,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this donation?")) return;
    await deleteDonation(id);
    fetchDonations();
  };

  // ================= SUBMIT =================
const handleSubmit = async (e) => {
  e.preventDefault();

  // 🔴 VALIDATION: donation_goal max 10 digits
  const donationStr = String(formData.donation_goal);

  if (!/^\d+$/.test(donationStr)) {
    alert("Donation amount must be numeric");
    return;
  }

  if (donationStr.length > 10) {
    alert("Donation amount cannot exceed 10 digits");
    return;
  }

  try {
    const payload = new FormData();

    payload.append("category", Number(formData.category_id));
    payload.append("title", formData.title.trim());
    payload.append("description", formData.description.trim());
    payload.append("donation_goal", donationStr);

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

    if (mode === "add") await createDonation(payload);
    if (mode === "edit") await updateDonation(formData.id, payload);

    setShowForm(false);
    fetchDonations();
  } catch (err) {
    console.error("SUBMIT ERROR:", err.response?.data || err);
    alert("Donation save failed");
  }
};



  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {/* ================= HEADER ================= */}
      {!showForm && (
        <div className="mb-4">
          <h2 className="mb-3">💰 Donations</h2>
          <div className="d-flex justify-content-end">
            <button className="btn btn-primary" onClick={handleAdd}>
              + Add Donation
            </button>
          </div>
        </div>
      )}

      {/* ================= FORM ================= */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between">
            <strong className="text-capitalize">{mode} Donation</strong>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setShowForm(false)}
            >
              ← Back
            </button>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* CATEGORY DROPDOWN */}
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
                placeholder="Donation Title"
                value={formData.title || ""}
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
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                disabled={mode === "view"}
              />

              {/* GOAL */}
          <input
  type="number"
  className="form-control mb-3"
  placeholder="Donation Goal"
  value={formData.donation_goal || ""}
  onChange={(e) => {
    const value = e.target.value;
    if (value.length <= 8) {
      setFormData({ ...formData, donation_goal: value });
    }
  }}
  disabled={mode === "view"}
  required
/>


              {/* IMAGE PREVIEW */}
              {formData.image && typeof formData.image === "string" && (
                <div className="mb-3">
                  <img
                    src={`${BASE_URL}${formData.image}`}
                    alt="donation"
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
                  {mode === "add" ? "Save Donation" : "Update Donation"}
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
              <th>Goal</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {donations.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted py-4">
                  No donations found
                </td>
              </tr>
            )}

            {donations.map((item, index) => (
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
                <td>₹ {item.donation_goal}</td>
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
