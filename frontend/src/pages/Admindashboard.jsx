import React, { useEffect, useState } from "react";
import API from "../api";
import { logout } from "../store/authslice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import "./Admindashboard.css";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handout() {
    dispatch(logout());
    navigate('/login');
  }

  const fetchUsers = () => {
    setLoading(true);
    API.get("/api/userss/")
      .then((res) => setUsers(res.data))
      .catch((error) => {
        toast.error("Failed to fetch users");
        console.error("Error fetching users:", error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUserss = (query = "") => {
    API.get(`/api/userss/?search=${query}`)
      .then((res) => setUsers(res.data))
      .catch((error) => {
        toast.error("Failed to search users");
        console.error("Error searching users:", error);
      });
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchUserss(value);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingId) {
        const payload = {
          username: form.username,
          email: form.email
        };
        await API.patch(`/api/userss/${editingId}/`, payload);
        toast.success("User updated successfully!");
      } else {
        await API.post("/api/userss/", form);
        toast.success("User created successfully!");
      }
      setForm({ username: "", email: "", password: "" });
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      if (err.response?.data) {
        const errors = err.response.data;
        let errorMessage = "Something went wrong.";
        
        if (typeof errors === "string") {
          errorMessage = errors;
        } else if (typeof errors === "object") {
          errorMessage = Object.values(errors).flat().join(" ");
        }
        
        toast.error(errorMessage);
      } else {
        toast.error("Server is not responding.");
      }
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (user) => {
    setDeleteModal({ isOpen: true, user });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, user: null });
  };

  const handleDelete = async () => {
    if (!deleteModal.user) return;
    
    try {
      await API.delete(`/api/userss/${deleteModal.user.id}/`);
      toast.success("User deleted successfully!");
      fetchUsers();
      closeDeleteModal();
    } catch (error) {
      toast.error("Failed to delete user");
      console.error("Error deleting user:", error);
      closeDeleteModal();
    }
  };

  const handleEdit = (user) => {
    setForm({ username: user.username, email: user.email, password: "" });
    setEditingId(user.id);
  };

  const cancelEdit = () => {
    setForm({ username: "", email: "", password: "" });
    setEditingId(null);
  };

  const isUserAdmin = (user) => {
    return user.is_superuser || user.is_staff || user.is_admin;
  };

  return (
    <div className="adminContainer">
      <h2 className="adminTitle">Admin Dashboard</h2>

      <div className="adminHeader">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={handleSearch}
          className="adminSearch"
        />
        <button onClick={handout} className="logoutButton">logout</button>
      </div>

      <form onSubmit={handleSubmit} className="adminForm">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          className="adminInput"
          disabled={loading}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="adminInput"
          disabled={loading}
        />
        {!editingId && (
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="adminInput"
            disabled={loading}
          />
        )}
        <div className="adminFormButtons">
          <button 
            type="submit" 
            className="adminButton button-primary"
            disabled={loading}
          >
            {loading ? "Processing..." : editingId ? "Update User" : "Create User"}
          </button>
          {editingId && (
            <button 
              type="button" 
              onClick={cancelEdit}
              className="adminButton button-secondary"
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading && !users.length ? (
        <div className="adminLoading">Loading users...</div>
      ) : (
        <table className="adminTable">
          <thead>
            <tr>
              <th className="adminTh">ID</th>
              <th className="adminTh">Profile Picture</th>
              <th className="adminTh">Username</th>
              <th className="adminTh">Email</th>
              <th className="adminTh">Admin</th>
              <th className="adminTh">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="adminTr">
                <td className="adminTd">{u.id}</td>
                <td className="adminTd">
                  {u.profile_image ? (
                    <img
                      src={u.profile_image}
                      alt="Profile"
                      className="profileImage"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className="adminTd">{u.username}</td>
                <td className="adminTd">{u.email}</td>
                <td className="adminTd">
                  {isUserAdmin(u) ? "Yes" : "No"}
                </td>
                <td className="adminTd">
                  <button
                    onClick={() => handleEdit(u)}
                    className="adminButton button-success"
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(u)}
                    className="adminButton button-danger"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {deleteModal.isOpen && (
        <div className="modalOverlay">
          <div className="modal">
            <h3 className="modalTitle">Confirm Delete</h3>
            <p className="modalText">
              Are you sure you want to delete user <strong>"{deleteModal.user?.username}"</strong>?
              This action cannot be undone.
            </p>
            <div className="modalActions">
              <button
                onClick={closeDeleteModal}
                className="modalButton button-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="modalButton button-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;