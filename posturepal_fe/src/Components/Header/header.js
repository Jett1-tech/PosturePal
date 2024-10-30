import React, { useState, useEffect } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, BellIcon } from "@heroicons/react/24/outline";
import LoginForm from "../Login/loginForm";
import SignupForm from "../SignUp/signupForm";
import { Modal } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { toast } from "react-hot-toast";
import ShoppingCart from "../ShoppingCart/shoppingCart";
import LogoutConfirmDialog from "../Confirmation/LogoutConfirmDialog";
import PPLogo from "../../Images/Logo/PPLogo.png";
const navigation = [
  { name: "Products", href: "#product-section" },
  { name: "Collections", href: "#collection-section" },
  { name: "Features", href: "#features-section" },
  { name: "Company", href: "#company-section" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("pls login", token);
    } else {
      setIsLoggedIn(token);
      
    }
  }, []);

  const showModal = () => {
    setOpen(true);
    setIsSignUp(false);
  };

  const switchToSignUp = () => {
    setIsSignUp(true);
  };

  const switchToLogin = () => {
    setIsSignUp(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    toast.success("Logged out successfully!");
    setShowLogoutDialog(false);
  };

  const cancelLogout = () => {
    setShowLogoutDialog(false);
  };

  const handleCartClick = () => {
    if (isLoggedIn) {
      setCartOpen(true);
    } else {
      toast.error("Please log in to view your cart.");
    }
  };
   const handleBellClick = () => {
     if (!isLoggedIn) {
       toast.error("Please log in to view notifications.");
     } else {
       console.log("Notifications clicked");
     }
   };
  return (
    <div className="bg-white mb-10">
      <header className="relative lg:fixed lg:inset-x-0 lg:top-0 lg:z-50 bg-white shadow-sm">
        <nav
          aria-label="Global"
          className="flex items-center justify-between px-4 sm:px-6 lg:px-8"
        >
          {/* Logo Section */}
          <div className="flex lg:flex-1">
            <a href="/" className="no-underline">
              <img
                src={PPLogo}
                className="h-12 w-auto lg:h-24"
              />
            </a>
          </div>

          {/* Hamburger Menu Button for Mobile */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Centered Navigation Links for Desktop */}
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-gray-900 no-underline"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Shopping Cart and Login/Logout Section */}
          <div className="hidden lg:flex lg:items-center lg:justify-end">
            <button onClick={handleBellClick} className="mr-6">
              <BellIcon className="h-6 w-6 text-black" />
            </button>

            <button className="mr-6" onClick={handleCartClick}>
              <ShoppingCartOutlined
                style={{ fontSize: "24px", color: "black" }}
              />
            </button>
            <ShoppingCart open={cartOpen} setOpen={setCartOpen} />
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center text-sm font-semibold leading-6 text-gray-900 no-underline"
              >
                Logout <span aria-hidden="true">&rarr;</span>
              </button>
            ) : (
              <a
                onClick={showModal}
                className="text-sm font-semibold leading-6 text-gray-900 no-underline cursor-pointer"
              >
                Log in <span aria-hidden="true">&rarr;</span>
              </a>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <Dialog
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          className="lg:hidden"
        >
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="/" className="-m-1.5 p-1.5 no-underline">
                <span className="sr-only">Your Company</span>
                <img alt="" src="your-logo-url" className="h-8 w-auto" />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 no-underline"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                {/* Shopping Cart Icon for Mobile */}
                <div className="py-6 flex">
                  <button onClick={handleCartClick}>
                    <ShoppingCartOutlined
                      style={{ fontSize: "20px", color: "black" }}
                    />
                  </button>
                </div>
                <div className="py-6 flex">
                  <button onClick={handleBellClick}>
                    <BellIcon className="h-6 w-6 text-black" />
                  </button>
                </div>

                <div className="py-6">
                  {isLoggedIn ? (
                    <button
                      onClick={handleLogout}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 no-underline cursor-pointer"
                    >
                      Logout
                    </button>
                  ) : (
                    <a
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 no-underline cursor-pointer"
                      onClick={showModal}
                    >
                      Log in
                    </a>
                  )}
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      <Modal open={open} onCancel={handleCancel} footer={null}>
        {isSignUp ? (
          <SignupForm switchToLogin={switchToLogin} />
        ) : (
          <LoginForm switchToSignUp={switchToSignUp} />
        )}
      </Modal>

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmDialog
        open={showLogoutDialog}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </div>
  );
}
