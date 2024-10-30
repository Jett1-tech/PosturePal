import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

function UserEdit() {
  const params = useParams();
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_API_URL}/api/user/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      myFormik.setValues(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load user data!");
    } finally {
      setLoading(false);
    }
  };

  const myFormik = useFormik({
    initialValues: {
      username: "",
      phone: "",
      userRole: "",
    },
    validate: (values) => {
      let errors = {};
      if (!values.username) {
        errors.username = "Please enter username";
      } else if (values.username.length < 4) {
        errors.username = "Name shouldn't be less than 5 letters";
      } else if (values.username.length > 20) {
        errors.username = "Name shouldn't be more than 25 letters";
      }

      if (!values.phone) {
        errors.phone = "Please enter phone number";
      }

      if (!values.userRole) {
        errors.userRole = "Please select a role";
      }

      return errors;
    },

    onSubmit: async (values) => {
      setLoading(true);
      try {
        await axios.put(`${BASE_API_URL}/api/user/${params.id}`, values, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("User updated successfully!");
        navigate("/admin/user-list");
      } catch (error) {
        console.log(
          "User update failed:",
          error.response?.data || error.message || error
        );
        toast.error("Failed to update user!");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <h3>UserEdit - Id : {params.id} </h3>
      <div className="container">
        <form onSubmit={myFormik.handleSubmit}>
          <div className="row">
            <div className="col-lg-6">
              <label>Username</label>
              <input
                name="username"
                value={myFormik.values.username}
                onChange={myFormik.handleChange}
                type="text"
                className={`form-control ${
                  myFormik.errors.username ? "is-invalid" : ""
                }`}
              />
              <span style={{ color: "red" }}>{myFormik.errors.username}</span>
            </div>

            <div className="col-lg-6">
              <label>Phone</label>
              <input
                name="phone"
                value={myFormik.values.phone}
                onChange={myFormik.handleChange}
                type="text"
                className={`form-control ${
                  myFormik.errors.phone ? "is-invalid" : ""
                }`}
              />
              <span style={{ color: "red" }}>{myFormik.errors.phone}</span>
            </div>

            <div className="col-lg-6">
              <label>Role</label>
              <select
                name="userRole"
                value={myFormik.values.userRole}
                onChange={myFormik.handleChange}
                className={`form-control ${
                  myFormik.errors.userRole ? "is-invalid" : ""
                }`}
              >
                <option value="">----Select Role----</option>
                <option value="admin">Admin</option>
                <option value="buyer">Buyer</option>
                {/* Thêm các vai trò khác nếu cần */}
              </select>
              <span style={{ color: "red" }}>{myFormik.errors.userRole}</span>
            </div>

            <div className="col-lg-4 mt-3">
              <input
                disabled={isLoading}
                type="submit"
                value={isLoading ? "Updating..." : "Update"}
                className="btn btn-primary"
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default UserEdit;
