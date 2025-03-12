export default function Sidebar() {
    return (
      <div className="w-64 bg-white p-5 shadow-md hidden md:block">
        <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
        <ul className="mt-5 space-y-2">
          <li className="p-2 bg-gray-200 rounded-md">Dashboard</li>
          <li className="p-2 hover:bg-gray-200 rounded-md">Tải ảnh lên</li>
          <li className="p-2 hover:bg-gray-200 rounded-md">Thêm sản phẩm</li>
          <li className="p-2 hover:bg-gray-200 rounded-md">Danh sách sản phẩm</li>
        </ul>
      </div>
    );
  }
  