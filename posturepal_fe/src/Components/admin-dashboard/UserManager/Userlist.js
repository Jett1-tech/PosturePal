import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DeleteConfirmDialog from "../ProductManager/DeleteConfirmDialog";
import toast from "react-hot-toast";
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

function UserList() {
  const [userList, setUserList] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(`${BASE_API_URL}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserList(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users!"); 
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (id) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        await axios.delete(`${BASE_API_URL}/api/user/${userToDelete}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setDeleteDialogOpen(false);
        setUserToDelete(null);
        toast.success("Deleted user successfully!");
        getUsers();
      } catch (error) {
        toast.error("Failed to delete user!");
        console.error(error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">User List</h1>
      </div>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">User Table</h6>
        </div>
        <div className="card-body">
          {isLoading ? (
            <img
              src="https://media.giphy.com/media/ZO9b1ntYVJmjZlsWlm/giphy.gif"
              alt="Loading"
            />
          ) : (
            <div className="table-responsive">
              <table
                className="table table-bordered"
                width="100%"
                cellSpacing="0"
              >
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userList.map((user) => (
                    <tr key={user._id}>
                      <td>{user._id}</td>
                      <td>{user.username}</td>
                      <td>{user.phone}</td>
                      <td>{user.userRole}</td>
                      <td>
                        <Link
                          to={`/admin/user-view/${user._id}`}
                          className="btn btn-primary btn-sm mr-1"
                        >
                          View
                        </Link>
                        <Link
                          to={`/admin/user-edit/${user._id}`}
                          className="btn btn-info btn-sm mr-1"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => openDeleteDialog(user._id)}
                          className="btn btn-danger btn-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Render the DeleteConfirmDialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  );
}

export default UserList;
