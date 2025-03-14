import { FiMenu, FiBell, FiSettings, FiSearch } from "react-icons/fi";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center bg-white p-4 shadow-md">
      <button className=" btn-admin-header text-xl">
        <FiMenu />
      </button>
      <div className="flex items-center space-x-4">
        <FiSearch className="text-xl" />
        <FiBell className="text-xl" />
        <FiSettings className="text-xl" />
      </div>
    </div>
  );
}
