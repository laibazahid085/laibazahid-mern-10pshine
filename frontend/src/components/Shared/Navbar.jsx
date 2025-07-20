import { useState } from "react";
import "./Navbar.css";

const Navbar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    onSearch(query); 
  };

  return (
    <nav className="navbar">
      <h2 className="logo">📝 Notes App</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search notes..."
        className="search-input"
      />
    </nav>
  );
};

export default Navbar;
