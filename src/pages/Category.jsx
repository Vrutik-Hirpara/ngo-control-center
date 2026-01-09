import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categories.service";
import '../styles/layout.css'

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("add"); // add | view | edit

  const [formData, setFormData] = useState({
    id: null,
    title: "",
    image: null, // string | File
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= ACTIONS =================
  const handleAdd = () => {
    setMode("add");
    setFormData({ id: null, title: "", image: null });
    setShowForm(true);
  };

  const handleView = (cat) => {
    setMode("view");
    setFormData(cat); // image = string
    setShowForm(true);
  };

  const handleEdit = (cat) => {
    setMode("edit");
    setFormData(cat); // image = string
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    await deleteCategory(id);
    fetchCategories();
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = new FormData();
      payload.append("title", formData.title.trim());

      // 🔥 ADD → image required
      if (mode === "add") {
        if (!(formData.image instanceof File)) {
          alert("Image is required");
          return;
        }
        payload.append("image", formData.image);
      }

      // 🔥 EDIT → image ONLY if changed
      if (mode === "edit" && formData.image instanceof File) {
        payload.append("image", formData.image);
      }

      if (mode === "add") await createCategory(payload);
      if (mode === "edit") await updateCategory(formData.id, payload);

      setShowForm(false);
      fetchCategories();
    } catch (err) {
      console.error("CATEGORY SAVE ERROR:", err.response?.data || err);
      alert("Category save failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {/* ================= HEADER ================= */}
      {!showForm && (
        <div className="mb-4">
          <h2 className="mb-3">📂 Categories</h2>
          <div className="d-flex justify-content-end">
            <button className="btn btn-primary" onClick={handleAdd}>
              + Add Category
            </button>
          </div>
        </div>
      )}

      {/* ================= FORM ================= */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between">
            <strong className="text-capitalize">{mode} Category</strong>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setShowForm(false)}
            >
              ← Back
            </button>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* TITLE */}
              <input
                className="form-control mb-2"
                placeholder="Category Title"
                value={formData.title || ""}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                disabled={mode === "view"}
                required
              />

              {/* IMAGE PREVIEW (VIEW + EDIT) */}
              {formData.image && typeof formData.image === "string" && (
                <div className="mb-3">
                  <img
                    src={`${BASE_URL}${formData.image}`}
                    alt="category"
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

              {/* IMAGE INPUT (ADD + EDIT) */}
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
                  {mode === "add" ? "Save Category" : "Update Category"}
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
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-muted py-4">
                  No categories found
                </td>
              </tr>
            )}

            {categories.map((cat, index) => (
              <tr key={cat.id}>
                <td>{index + 1}</td>
                <td>
                  <img
                    src={`${BASE_URL}${cat.image}`}
                    className="category-img"
                  />
                </td>
                <td>{cat.title}</td>
                <td className="text-center">
                  <div className="action-group">
                    <button
                      className="btn btn-outline-info btn-sm"
                      onClick={() => handleView(cat)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-outline-warning btn-sm"
                      onClick={() => handleEdit(cat)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(cat.id)}
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
