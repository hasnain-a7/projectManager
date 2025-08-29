import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
interface AccountDropdownprop {
  onLogout: () => void;
}
const AccountDropdown: React.Fc<AccountDropdownprop> = ({ onLogout }) => {
  const [open, setOpen] = useState(false);

  const toggleDropdown = () => {
    setOpen(!open);
  };

  return (
    <div className="relative ">
      <div
        className="cursor-pointer text-white text-2xl p-1 transition-colors duration-200 hover:text-gray-300"
        onClick={toggleDropdown}
      >
        <FaUser size={24} />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-10 right-3 h-[40px] flex justify-center items-center bg-white shadow-md rounded-lg p-3 min-w-[120px] z-50 animate-fadeIn">
          <button
            onClick={onLogout}
            className="bg-gray-900 text-slate-100  w-[50%] rounded-md cursor-pointer transition-colors duration-200 hover:bg-gray-800"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountDropdown;
