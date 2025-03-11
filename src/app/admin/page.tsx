"use client";

import withAdmin from "../hoc/withAdmin";

function AdminPage() {
  return (
    <div className="container">
      <h1>Trang Quản Trị</h1>
      <p>Chào mừng Admin đến với trang quản lý.</p>
    </div>
  );
}

export default withAdmin(AdminPage);
