import {
  faFaceLaughWink,
  faTachographDigital,
  faUsers,
  faBox,
  faCartShopping
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
// const BASE_FE_URL = process.env.REACT_APP_BASE_FE_URL;

function Sidebar() {
  return (
    <ul
      className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
      id="accordionSidebar"
    >
      {/* <!-- Sidebar - Brand --> */}
      <a
        className="sidebar-brand d-flex align-items-center justify-content-center"
        // href={`${BASE_FE_URL}/admin/`}
      >
        <div className="sidebar-brand-icon rotate-n-15">
          <FontAwesomeIcon icon={faFaceLaughWink} size={"2x"} />
        </div>
        <div className="sidebar-brand-text mx-3">PosturePal Admin</div>
      </a>

      {/* <!-- Divider --> */}
      <hr className="sidebar-divider my-0" />

      {/* <!-- Nav Item - Dashboard --> */}
      <li className="nav-item active">
        <Link className="nav-link" to="/admin/dashboard">
          <FontAwesomeIcon
            icon={faTachographDigital}
            style={{ marginRight: "0.5rem" }}
          />
          <span>Dashboard</span>
        </Link>
      </li>
      {/* <!-- Divider --> */}
      <hr className="sidebar-divider my-0" />

      {/* <!-- Nav Item - Users --> */}
      <li className="nav-item active">
        <Link className="nav-link" to="/admin/user-list">
          <FontAwesomeIcon icon={faUsers} style={{ marginRight: "0.5rem" }} />
          <span>Users</span>
        </Link>
      </li>
      <hr className="sidebar-divider my-0" />

      {/* <!-- Nav Item - Products --> */}
      <li className="nav-item active">
        <Link className="nav-link" to="/admin/products/">
          <FontAwesomeIcon icon={faBox} style={{ marginRight: "0.5rem" }} />
          <span>Products</span>
        </Link>
      </li>
      <li className="nav-item active">
        <Link className="nav-link" to="/admin/order-list/">
          <FontAwesomeIcon
            icon={faCartShopping}
            style={{ marginRight: "0.5rem" }}
          />
          <span>Order</span>
        </Link>
      </li>
    </ul>
  );
}

export default Sidebar;
