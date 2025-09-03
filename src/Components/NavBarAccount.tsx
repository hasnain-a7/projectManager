import { useRef } from "react";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const AccountDropdown = ({ onLogout }: { onLogout: () => void }) => {
  return (
    <div className="relative">
      <ul className=" text-sm">
        <li>
          <Link to="/profile" className="flex items-center w-full px-4 py-2 ">
            <FaUser size={18} />
          </Link>
        </li>

        <li>
          <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-2 cursor-pointer"
          >
            <FaSignOutAlt size={18} />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AccountDropdown;
