import React, { useState } from "react";
import { Menu, Dropdown, Button, Badge, Input } from "antd";
import {
  BellOutlined,
  MailOutlined,
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import LogoutConfirmDialog from "../Confirmation/LogoutConfirmDialog"; // Đảm bảo bạn đã import đúng

const { Search } = Input;

const Topbar = () => {
  const navigate = useNavigate();
  const [isLogoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogout = () => {
    setLogoutDialogOpen(true);
  };

  const handleConfirmLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      if (token) {
        localStorage.removeItem("token");
        toast.success("Logged out successfully!");
        setTimeout(() => {
          navigate("/admin");
        }, 2000);
      } else {
        toast.error("No token found. Please login again.");
      }
    } catch (error) {
      console.log(
        "Logout failed:",
        error.response?.data || error.message || error
      );
    } finally {
      setLogoutDialogOpen(false);
    }
  };

  const handleCancelLogout = () => {
    setLogoutDialogOpen(false);
  };

  const alertMenu = (
    <Menu
      items={[
        {
          key: "0",
          label: (
            <div className="py-2 px-4 text-gray-700 hover:bg-gray-100">
              December 12, 2019: A new monthly report is ready to download!
            </div>
          ),
        },
        {
          key: "1",
          label: (
            <div className="py-2 px-4 text-gray-700 hover:bg-gray-100">
              December 7, 2019: $290.29 has been deposited into your account!
            </div>
          ),
        },
        {
          key: "2",
          label: (
            <div className="py-2 px-4 text-gray-700 hover:bg-gray-100">
              December 2, 2019: Spending Alert: We've noticed unusually high
              spending for your account.
            </div>
          ),
        },
        {
          key: "3",
          label: (
            <Link
              to="#"
              className="text-center block py-2 px-4 text-gray-500 hover:bg-gray-100"
            >
              Show All Alerts
            </Link>
          ),
        },
      ]}
    />
  );

  const messageMenu = (
    <Menu
      items={[
        {
          key: "0",
          label: (
            <div className="py-2 px-4 text-gray-700 hover:bg-gray-100">
              Emily Fowler: Hi there! I am wondering if you can help me with a
              problem I've been having.
            </div>
          ),
        },
        {
          key: "1",
          label: (
            <div className="py-2 px-4 text-gray-700 hover:bg-gray-100">
              Jae Chun: I have the photos that you ordered last month, how would
              you like them sent to you?
            </div>
          ),
        },
        {
          key: "2",
          label: (
            <div className="py-2 px-4 text-gray-700 hover:bg-gray-100">
              Morgan Alvarez: Last month's report looks great, I am very happy
              with the progress so far, keep up the good work!
            </div>
          ),
        },
        {
          key: "3",
          label: (
            <Link
              to="#"
              className="text-center block py-2 px-4 text-gray-500 hover:bg-gray-100"
            >
              Read More Messages
            </Link>
          ),
        },
      ]}
    />
  );

  const userMenu = (
    <Menu
      items={[
        {
          key: "profile",
          label: (
            <Link to="#" className="py-2 px-4 text-gray-700 hover:bg-gray-100">
              <UserOutlined className="mr-2" />
              Profile
            </Link>
          ),
        },
        {
          key: "settings",
          label: (
            <Link to="#" className="py-2 px-4 text-gray-700 hover:bg-gray-100">
              <UserOutlined className="mr-2" />
              Settings
            </Link>
          ),
        },
        {
          key: "activity",
          label: (
            <Link to="#" className="py-2 px-4 text-gray-700 hover:bg-gray-100">
              <UserOutlined className="mr-2" />
              Activity Log
            </Link>
          ),
        },
        { type: "divider" },
        {
          key: "logout",
          label: (
            <Button
              onClick={handleLogout}
              className="w-full text-left py-2 px-4 text-gray-700 hover:bg-gray-100"
            >
              <UserOutlined className="mr-2" />
              Logout
            </Button>
          ),
        },
      ]}
    />
  );

  return (
    <>
      <nav className="bg-white shadow-md flex items-center justify-between px-4 pt-3 pb-3 mb-4">
        {/* Search */}
        <div className="relative max-w-md flex-grow">
          <Search
            placeholder="Search for..."
            className="border-0 rounded-full py-1 px-3 w-full"
            suffix={<SearchOutlined />}
          />
        </div>

        {/* Navbar Items */}
        <div className="flex items-center space-x-4">
          {/* Alerts */}
          <Dropdown overlay={alertMenu} trigger={["click"]}>
            <Button className="p-2 rounded-full text-gray-600 hover:bg-gray-100">
              <Badge count={3} size="small" className="mr-2">
                <BellOutlined />
              </Badge>
            </Button>
          </Dropdown>

          {/* Messages */}
          <Dropdown overlay={messageMenu} trigger={["click"]}>
            <Button className="p-2 rounded-full text-gray-600 hover:bg-gray-100">
              <Badge count={7} size="small" className="mr-2">
                <MailOutlined />
              </Badge>
            </Button>
          </Dropdown>

          {/* User */}
          <Dropdown overlay={userMenu} trigger={["click"]}>
            <Button className="p-2 rounded-full text-gray-600 hover:bg-gray-100">
              <UserOutlined />
            </Button>
          </Dropdown>
        </div>
      </nav>

      {/* Logout Confirm Dialog */}
      <LogoutConfirmDialog
        open={isLogoutDialogOpen}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </>
  );
};

export default Topbar;
