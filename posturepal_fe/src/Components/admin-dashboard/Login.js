import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast} from "react-hot-toast";
import PPLogo from "../../Images/Logo/PPLogo.png";
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BASE_API_URL}/api/user/login?isAdminPage=true`,
        {
          username,
          password,
        }
      );
       if (response.status === 200) {
         localStorage.setItem("token", response.data.token);
         console.log("Token stored:", localStorage.getItem("token"));
         toast.success("Login successful! Redirecting...");
         setTimeout(() => {
             navigate("/admin/dashboard");
         }, 1500);
       } else {
         toast.error(response.data.message);
       }
    } catch (error) {
      console.error("Login failed", error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-xl-10 col-lg-12 col-md-9">
        <div className="card o-hidden border-0 shadow-lg my-5 ">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-6 d-none d-lg-block bg-login-image">
                <img src={PPLogo} alt="Background" />
              </div>
              <div className="col-lg-6 pt-28">
                <div className="p-5">
                  <div className="text-center">
                    <h1 className="h4 text-gray-900 mb-4">
                      Wellcome to Admin Login page!
                    </h1>
                  </div>
                  <form className="user" onSubmit={handleLogin}>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control form-control-user"
                        id="exampleInputUsername"
                        placeholder="Enter Username..."
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="password"
                        className="form-control form-control-user"
                        id="exampleInputPassword"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary btn-user btn-block"
                    >
                      Login
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
