import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBox = () => {
  const [searchKey, setSearchKey] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 🔥 Kiểm soát dropdown
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!searchKey.trim()) {
      console.warn("❌ Search key is empty, skipping search.");
      return;
    }
    navigate(`/search?query=${encodeURIComponent(searchKey)}`);
  };

  return (
    <div className="dropdown">
      {/* 🔥 Thay đổi toggle dropdown từ Bootstrap sang React */}
      <div
        className="search-box-drop"
        id="search-box-drop"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)} // ✅ Không dùng `data-bs-toggle`
      >
        <div className="d-flex align-items-center justify-content-between gap-2">
          <div className="search-box-inner">
            <button type="submit" className="search-box-drop-submit">
            </button>
            <input
              type="text"
              placeholder="Search Here..."
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(); // Kích hoạt tìm kiếm khi nhấn Enter
                }
              }}
            />
          </div>
          <button className="btn btn-primary search-box-btn" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {/* 🔥 Hiển thị dropdown đúng cách khi user click vào input */}
      {isDropdownOpen && (
        <ul className="p-0 sub-drop dropdown-menu dropdown-menu-end">
          <li className="px-3 py-2">🔍 Type to search...</li>
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
