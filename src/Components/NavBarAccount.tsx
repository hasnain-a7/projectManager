import { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaUser, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const AccountDropdown = ({ onLogout }: { onLogout: () => void }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <FaUserCircle className="w-6 h-6 text-gray-600 dark:text-gray-300 cursor-pointer" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-[#1a202c] shadow-lg rounded-sm border border-gray-200 dark:border-gray-800 z-50">
          <ul className="py-2 text-sm">
            <li>
              <Link
                to="/app/profile"
                className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <FaUser className="w-4 h-4 mr-2" />
                Profile
              </Link>
            </li>

            <li>
              <button
                onClick={onLogout}
                className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <FaSignOutAlt className="w-4 h-4 mr-2" /> Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AccountDropdown;
